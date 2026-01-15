import { Component, Inject, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
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

  constructor(
    public dialogRef: MatDialogRef<LoansEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
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
      loanDateShort: [``],
      expectedReturnBookDateShort: [``],
      returnDateShort: [``],
    });
  }

  setBookTitleById(idBook: number) {
    const book = this.books.find((b) => b.id == idBook);

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
          loanDateShort: res.data.loanDateShort,
          expectedReturnBookDateShort: res.data.expectedReturnBookDateShort,
          returnDateShort: res.data.returnDateShort,
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
    if (this.loanForm.invalid) return;

    const updatedLoan = {
      idLoan: Number(this.loanId),
      idBook: this.loanForm.get('idBook')?.value,
      personName: this.loanForm.get('personName')?.value,

      loanDate: parseDateToIso(this.loanForm.get('loanDateShort')?.value),
      expectedReturnBook: parseDateToIso(
        this.loanForm.get('expectedReturnBookDateShort')?.value
      ),
      returnDate: parseDateToIso(this.loanForm.get('returnDateShort')?.value),
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
        console.error(err);

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
      this.books = response.data;
      this.filteredBooks = response.data;

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
}
