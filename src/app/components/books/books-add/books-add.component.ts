import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { BookService } from '../../../services/book.service';
import { IBook } from '../../../interfaces/IBook';

@Component({
  selector: 'app-books-add',
  imports: [ReactiveFormsModule],
  templateUrl: './books-add.component.html',
  styleUrl: './books-add.component.css'
})
export class BooksAddComponent {
  private readonly _bookService = inject(BookService);
  private readonly fb = inject(FormBuilder)

  bookForm = this.fb.group({
    title: [``, Validators.required],
    description: [``],
    author: [``, Validators.required],
    catalog: [``, Validators.required],
    quantity: [0, [Validators.required, Validators.min(1)]],
    registrationDate: [``, Validators.required]
  });

  addBook(){
    if(this.bookForm.invalid) return;

    const newBook = this.bookForm.value;

    this._bookService.addBook(newBook as Partial<IBook>).subscribe({
      next:() => {
        this.bookForm.reset();
      },
      error: err =>{
        console.error(err);
      }
    })
  }
}
