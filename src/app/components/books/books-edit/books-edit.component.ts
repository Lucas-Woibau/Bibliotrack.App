import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookService } from '../../../services/book.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorSnackbarComponent } from '../../snackbar-messages/snackbar-error/error-snackbar.component';
import { SuccessSnackbarComponent } from '../../snackbar-messages/snackbar-success/success-snackbar.component';
import { NgxMaskDirective } from 'ngx-mask';
import { parseDateToIso } from '../../../utils/data.utils';
import { ToCamelCase } from '../../../utils/toCamelCase';

@Component({
  selector: 'app-books-edit',
  imports: [ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './books-edit.component.html',
  styleUrl: './books-edit.component.css'
})
export class BooksEditComponent implements OnInit{
  private readonly _bookService = inject(BookService);
  private readonly fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  bookForm!: FormGroup;
  isEdit = false;
  bookId!: number;
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<BooksEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {id:number}
  ) { }

  ngOnInit(): void {
    this.createForm();

    if (this.data?.id) {
      this.isEdit = true;
      this.bookId = this.data.id;
      this.loadBook();
    }
  }

  createForm(){
    this.bookForm = this.fb.group({
      title: [``, Validators.required],
      description: [``],
      author: [``],
      catalog: [``],
      quantity: [0, [Validators.required, Validators.min(0)]],
      registrationDate: [``]
    })
  }

  loadBook(){
    this._bookService.getBookById(this.bookId).subscribe({
      next: (res) =>{
        this.bookForm.patchValue({
          title: res.data.title,
          description: res.data.description,
          author: res.data.author,
          catalog: res.data.catalog,
          quantity: res.data.quantity,
          registrationDate: res.data.registrationDateShort
      });
      },
      error: () => {
        this.snackBar.openFromComponent(ErrorSnackbarComponent, {
          data: {message: 'Erro ao carregar o livro.'},
          duration: 5000
        });
        this.dialogRef.close();
      }
    });
  }

  saveBook() {
  if (this.bookForm.invalid) return;

  const updatedBook = {
    idBook: Number(this.bookId),
    title: this.bookForm.get('title')?.value,
    description: this.bookForm.get('description')?.value,
    author: this.bookForm.get('author')?.value,
    catalog: this.bookForm.get('catalog')?.value,
    quantity: this.bookForm.get('quantity')?.value,
    registrationDate: parseDateToIso(
    this.bookForm.get('registrationDate')?.value)
  };

  this._bookService.updateBook(updatedBook).subscribe({
  next: () => {
    this.snackBar.openFromComponent(SuccessSnackbarComponent, {
      data: { message: 'Livro atualizado com sucesso!' },
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['custom-snackbar']
    });

    this.dialogRef.close(true);
  },

  error: err => {
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
      data: {
        message: 'Erro ao atualizar o livro.',
        err
      },
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['custom-snackbar']
    });
  }
});
}

  cancel() {
    this.dialogRef.close(false);
  }

}

