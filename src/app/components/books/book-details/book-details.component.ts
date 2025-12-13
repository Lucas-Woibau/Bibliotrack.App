import { Component, Inject, inject, OnInit } from '@angular/core';
import { BookService } from '../../../services/book.service';
import { IBook } from '../../../interfaces/IBook';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
  private readonly _bookService = inject(BookService);
  book?: IBook;

  constructor(
    public dialogRef: MatDialogRef<BookDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) { }

  ngOnInit() {
    this.loadBook();
  }

  loadBook(){
  this._bookService.getBookById(this.data.id).subscribe({
    next: (response) =>{
      this.book = response.data;
      console.log(this.book);
    },
    error:(err)=>{
      console.log('Error to load loan', err);
    }
  });
  }
}
