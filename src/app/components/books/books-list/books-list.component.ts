import { Component, inject } from '@angular/core';
import { BookService } from '../../../services/book.service';
import { IBook } from '../../../interfaces/IBook';
import { BookLoanNavComponent } from "../../book-loan-nav/book-loan-nav.component";
import { MatDialog } from '@angular/material/dialog';
import { BookDetailsComponent } from '../book-details/book-details.component';

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

  ngOnInit(){
    this.loadBooks();
  }

  loadBooks(){
    this._bookService.getBooks().subscribe(
    (response) => {
      console.log("API RESPONSE => ", response.data);
      this.Books = response.data;
    console.log("BOOKS SETADO =>", this.Books);}
    );
  }

  openDetailsModal(id: number){
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
}


