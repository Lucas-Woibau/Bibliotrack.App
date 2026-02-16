import { Component, inject } from '@angular/core';
import { BookService } from '../../../services/book.service';
import { BookLoanNavComponent } from '../../book-loan-nav/book-loan-nav.component';
import { MatDialog } from '@angular/material/dialog';
import { BookDetailsComponent } from '../book-details/book-details.component';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { BooksAddComponent } from '../books-add/books-add.component';
import { ModalConfimationComponent } from '../../modal-confimation/modal-confimation.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SuccessSnackbarComponent } from '../../snackbar-messages/snackbar-success/success-snackbar.component';
import { BooksEditComponent } from '../books-edit/books-edit.component';
import { IBook } from '../../../models/IBook';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-books-list',
  imports: [BookLoanNavComponent, CommonModule],
  templateUrl: './books-list.component.html',
  styleUrl: './books-list.component.css',
})
export class BooksListComponent {
  private readonly _bookService = inject(BookService);
  Books: IBook[] = [];
  private dialog = inject(MatDialog);
  private search$ = new Subject<string>();
  private snackBar = inject(MatSnackBar);

  page = 1;
  size = 10;
  totalRecords = 0;
  pages: number[] = [];
  currentSearch = '';

  ngOnInit() {
    this.search$
      .pipe(debounceTime(150), distinctUntilChanged())
      .subscribe((search) => {
        this.page = 1;
        this.loadBooks(search);
      });

    this.search$.next('');
  }

  get totalPages(): number {
    const total = Number(this.totalRecords);
    const size = Number(this.size);

    if (!size || size <= 0) return 1;
    if (!total || total <= 0) return 1;

    return Math.max(1, Math.ceil(total / size));
  }

  loadBooks(search: string) {
    this.currentSearch = search;

    this._bookService
      .getBooks(search, this.page, this.size)
      .subscribe((response: any) => {
        const d = response.data;

        this.Books = d.items ?? d.Items ?? [];

        this.totalRecords = Number(d.totalRecords ?? d.TotalRecords ?? 0);

        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

        if (this.page > this.totalPages) {
          this.page = this.totalPages;
        }
      });
  }

  onSearch(value: string) {
    this.page = 1;
    this.search$.next(value);
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadBooks(this.currentSearch);
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadBooks(this.currentSearch);
    }
  }

  openBookDetailsModal(id: number) {
    this.dialog.open(BookDetailsComponent, {
      data: { id: id },
      disableClose: true,
      width: '520px',
      maxWidth: '95vw',
      autoFocus: false,
      enterAnimationDuration: '250ms',
      exitAnimationDuration: '150ms',
    });
  }

  openAddBookModal() {
    const dialogRef = this.dialog.open(BooksAddComponent, {
      disableClose: true,
      width: '520px',
      maxWidth: '95vw',
      autoFocus: false,
      enterAnimationDuration: '250ms',
      exitAnimationDuration: '150ms',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.loadBooks('');
      }
    });
  }

  openEditBookModal(id: number) {
    const dialogRef = this.dialog.open(BooksEditComponent, {
      data: { id },
      disableClose: true,
      width: '520px',
      maxWidth: '95vw',
      autoFocus: false,
      enterAnimationDuration: '250ms',
      exitAnimationDuration: '150ms',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.loadBooks('');
      }
    });
  }

  openDeleteBookModal(id: number) {
    const dialogRef = this.dialog.open(ModalConfimationComponent, {
      disableClose: true,
      width: '420px',
      maxWidth: '95vw',
      autoFocus: false,
      enterAnimationDuration: '250ms',
      exitAnimationDuration: '150ms',
      data: {
        title: 'Confirmar exclusão',
        message: 'Tem certeza que deseja excluir esse livro?',
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        icon: 'fa-check-circle',
        iconColor: 'text-danger',
        textColor: 'text-light',
        bgColor: 'bg-danger-subtle',
        btnBgColor: 'bg-danger',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed === true) {
        this._bookService.deleteBook(id).subscribe({
          next: () => {
            this.snackBar.openFromComponent(SuccessSnackbarComponent, {
              data: { message: 'Livro deletado com sucesso!' },
              duration: 4000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              panelClass: ['custom-snackbar'],
            });
            if (this.page > 1 && this.Books.length === 1) {
              this.page--;
            }

            this.loadBooks(this.currentSearch);
          },
        });
      }
    });
  }
}
