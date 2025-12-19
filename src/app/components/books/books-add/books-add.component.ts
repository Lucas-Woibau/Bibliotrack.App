import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { BookService } from '../../../services/book.service';
import { IBook } from '../../../interfaces/IBook';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SuccessSnackbarComponent } from '../../snackbar-messages/snackbar-success/success-snackbar.component';
import { ErrorSnackbarComponent } from '../../snackbar-messages/snackbar-error/error-snackbar.component';

@Component({
  selector: 'app-books-add',
  imports: [ReactiveFormsModule],
  templateUrl: './books-add.component.html',
  styleUrl: './books-add.component.css'
})
export class BooksAddComponent {
  private readonly _bookService = inject(BookService);
  private readonly fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

constructor(
    public dialogRef: MatDialogRef<BooksAddComponent>
  ) { }

  bookForm = this.fb.group({
    title: [``, Validators.required],
    description: [``],
    author: [``],
    catalog: [``],
    quantity: [1, [Validators.required, Validators.min(1)]],
    registrationDate: [null]
  });

  addBook(){
    if(this.bookForm.invalid) return;

    const newBook = this.bookForm.value;

    this._bookService.addBook(newBook as Partial<IBook>).subscribe({
      next:() => {
        this.snackBar.openFromComponent(SuccessSnackbarComponent, {
          data: {message: 'Livro adicionado com sucesso!'},
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['custom-snackbar']
        });

        this.dialogRef.close(true);

      },
      error: err =>{
        this.snackBar.openFromComponent(ErrorSnackbarComponent, {
          data: {message: 'Erro ao salvar o livro.', err},
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['custom-snackbar']
        });
      }
    });
  }
}
