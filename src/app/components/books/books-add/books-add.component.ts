import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { BookService } from '../../../services/book.service';
import { IBook } from '../../../models/IBook';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SuccessSnackbarComponent } from '../../snackbar-messages/snackbar-success/success-snackbar.component';
import { ErrorSnackbarComponent } from '../../snackbar-messages/snackbar-error/error-snackbar.component';
import { NgxMaskDirective } from 'ngx-mask';
import { parseDateToIso } from '../../../utils/data.utils';
import { ToCamelCase } from '../../../utils/toCamelCase';

@Component({
  selector: 'app-books-add',
  imports: [ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './books-add.component.html',
  styleUrl: './books-add.component.css',
})
export class BooksAddComponent {
  private readonly _bookService = inject(BookService);
  private readonly fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  constructor(public dialogRef: MatDialogRef<BooksAddComponent>) {}

  bookForm = this.fb.group({
    title: [``, Validators.required],
    description: [``],
    author: [``],
    catalog: [``],
    quantity: [1, [Validators.required, Validators.min(1)]],
    registrationNumber: [null],
    registrationDate: [``],
  });

  addBook() {
    if (this.bookForm.invalid) return;

    const newBook = {
      title: this.bookForm.get('title')?.value,
      description: this.bookForm.get('description')?.value,
      author: this.bookForm.get('author')?.value,
      catalog: this.bookForm.get('catalog')?.value,
      quantity: this.bookForm.get('quantity')?.value,
      registrationNumber: this.bookForm.get('registrationNumber')?.value,
      registrationDate: parseDateToIso(
        this.bookForm.get('registrationDate')?.value ?? null,
      ),
    };

    this._bookService.addBook(newBook as Partial<IBook>).subscribe({
      next: () => {
        this.snackBar.openFromComponent(SuccessSnackbarComponent, {
          data: { message: 'Livro adicionado com sucesso!' },
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
            const control = this.bookForm.get(formField);

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
          data: { message: 'Erro ao salvar o livro.', err },
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['custom-snackbar'],
        });
      },
    });
  }
}
