import { Component, inject } from '@angular/core';
import { BookService } from '../../../services/book.service';
import { BookLoanNavComponent } from "../../book-loan-nav/book-loan-nav.component";
import { MatDialog } from '@angular/material/dialog';
import { BookDetailsComponent } from '../book-details/book-details.component';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { BooksAddComponent } from '../books-add/books-add.component';
import { DialogRef } from '@angular/cdk/dialog';
import { ModalConfimationComponent } from '../../modal-confimation/modal-confimation.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SuccessSnackbarComponent } from '../../snackbar-messages/snackbar-success/success-snackbar.component';
import { BooksEditComponent } from '../books-edit/books-edit.component';
import { IBook } from '../../../models/IBook';

@Component({
  selector: 'app-books-list',
  imports: [BookLoanNavComponent],
  templateUrl: './books-list.component.html',
  styleUrl: './books-list.component.css'
})
export class BooksListComponent {
  private readonly _bookService = inject(BookService);
  Books: IBook[] = [];
  private dialog = inject(MatDialog);
  private search$ = new Subject<string>();
  private snackBar = inject(MatSnackBar);

  ngOnInit(){
    this.loadBooks('');

    this.search$.pipe(
          debounceTime(100),
          distinctUntilChanged()
        ).subscribe(search => this.loadBooks(search));

        this.search$.next('');
  }

  loadBooks(search:string){
    this._bookService.getBooks(search).subscribe(
    (response) => {
      this.Books = response.data;}
    );
  }

  onSearch(value:string){
    this.search$.next(value);
  }

  openBookDetailsModal(id: number){
    this.dialog.open(BookDetailsComponent,{
      data: { id: id },
      disableClose: true,
      width: '520px',
      maxWidth: '95vw',
      autoFocus: false,
      enterAnimationDuration: '250ms',
      exitAnimationDuration: '150ms'
    });
  }

  openAddBookModal(){
    const dialogRef = this.dialog.open(BooksAddComponent,{
      disableClose: true,
      width: '520px',
      maxWidth: '95vw',
      autoFocus: false,
      enterAnimationDuration: '250ms',
      exitAnimationDuration: '150ms'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        this.loadBooks('');
      };
    });
  }

  openEditBookModal(id: number){
    const dialogRef = this.dialog.open(BooksEditComponent,{
      data: { id },
      disableClose: true,
      width: '520px',
      maxWidth: '95vw',
      autoFocus: false,
      enterAnimationDuration: '250ms',
      exitAnimationDuration: '150ms'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        this.loadBooks('');
      };
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
      cancelText: 'Cancelar'
    }
  });

  dialogRef.afterClosed().subscribe(confirmed => {
    if (confirmed === true) {
      this._bookService.deleteBook(id).subscribe({
        next: () => {
          this.snackBar.openFromComponent(SuccessSnackbarComponent, {
            data: {message: 'Livro deletado com sucesso!'},
            duration: 4000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['custom-snackbar']
          });
          this.loadBooks('');
        }
      });
    }
  });
}
}


