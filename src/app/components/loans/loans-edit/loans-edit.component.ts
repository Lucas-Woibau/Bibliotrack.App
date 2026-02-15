import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { LoanService } from '../../../services/loan.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorSnackbarComponent } from '../../snackbar-messages/snackbar-error/error-snackbar.component';
import { SuccessSnackbarComponent } from '../../snackbar-messages/snackbar-success/success-snackbar.component';
import { parseDateToIso } from '../../../utils/data.utils';
import { IBook } from '../../../models/IBook';
import { BookService } from '../../../services/book.service';
import { ToCamelCase } from '../../../utils/toCamelCase';

@Component({
  selector: 'app-loans-edit',
  imports: [ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './loans-edit.component.html',
  styleUrl: './loans-edit.component.css',
})
export class LoansEditComponent implements OnInit {
  private readonly _loanService = inject(LoanService);
  private readonly _bookService = inject(BookService);
  private readonly fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  loanForm!: FormGroup;
  isEdit = false;
  loanId!: number;
  loading = false;

  books: IBook[] = [];
  filteredBooks: IBook[] = [];
  private selectedBookId?: number;

  bookSearchControl = new FormControl('');
  showDropdown = false;

  @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<LoansEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.loadBooks('');

    if (this.data?.id) {
      this.isEdit = true;
      this.loanId = this.data.id;
      this.loadLoan();
    }
  }

  createForm() {
    this.loanForm = this.fb.group({
      idBook: [``],
      personName: [``],
      loanDate: [``],
      expectedReturnBook: [``],
      returnDate: [``],
    });
  }

  setBookTitleById(idBook: number) {
    const book = this.books.find((b) => b.id === idBook);

    if (book) {
      this.bookSearchControl.setValue(book.title, { emitEvent: false });
    }
  }

  loadLoan() {
    this._loanService.getLoanById(this.loanId).subscribe({
      next: (res) => {
        this.selectedBookId = res.data.idBook;

        this.loanForm.patchValue({
          idBook: res.data.idBook,
          personName: res.data.personName,
          loanDate: res.data.loanDateShort,
          expectedReturnBook: res.data.expectedReturnBookDateShort,
          returnDate: res.data.returnDateShort,
        });
        if (this.books.length > 0) {
          this.setBookTitleById(this.selectedBookId);
        }
      },
      error: () => {
        this.snackBar.openFromComponent(ErrorSnackbarComponent, {
          data: { message: 'Erro ao carregar o empréstimo.' },
          duration: 5000,
        });
        this.dialogRef.close();
      },
    });
  }

  saveLoan() {
    if (this.loanForm.invalid) {
      this.loanForm.markAllAsTouched();
      return;
    }

    const updatedLoan = {
      idLoan: Number(this.loanId),
      idBook: this.loanForm.get('idBook')?.value,
      personName: this.loanForm.get('personName')?.value,

      loanDate: parseDateToIso(this.loanForm.get('loanDate')?.value),
      expectedReturnBook: parseDateToIso(
        this.loanForm.get('expectedReturnBook')?.value,
      ),
      returnDate: parseDateToIso(this.loanForm.get('returnDate')?.value),
    };

    this._loanService.updateLoan(updatedLoan).subscribe({
      next: () => {
        this.snackBar.openFromComponent(SuccessSnackbarComponent, {
          data: { message: 'Livro atualizado com sucesso!' },
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['custom-snackbar'],
        });

        this.dialogRef.close(true);
      },

      error: (err) => {
        if (err.status === 400 && err.error?.errors) {
          const errors = err.error.errors;

          Object.keys(errors).forEach((apiField) => {
            const formField = ToCamelCase(apiField);
            const control = this.loanForm.get(formField);

            if (control) {
              control.setErrors({
                ...control.errors,
                apiError: errors[apiField][0],
              });

              control.markAsTouched();
            }
          });

          return;
        }

        this.snackBar.openFromComponent(ErrorSnackbarComponent, {
          data: {
            message: 'Erro ao atualizar o livro.',
            err,
          },
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['custom-snackbar'],
        });
      },
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }

  loadBooks(search: string) {
    this._bookService.getBooks(search).subscribe((response) => {
      this.books = response.data.items;
      this.filteredBooks = response.data.items;

      if (this.selectedBookId) {
        this.setBookTitleById(this.selectedBookId);
      }
    });
  }

  openDropdown() {
    this.showDropdown = true;
  }

  selectBook(book: IBook) {
    this.bookSearchControl.setValue(book.title, { emitEvent: false });
    this.loanForm.patchValue({ idBook: book.id });
    this.showDropdown = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.dropdownContainer) return;

    const clickedInside = this.dropdownContainer.nativeElement.contains(
      event.target,
    );

    if (!clickedInside) {
      this.showDropdown = false;
    }
  }
}
