import { Component, inject } from '@angular/core';
import { BookService } from '../../../services/book.service';
import { IBookInterface } from '../../../interfaces/IBook-interface';

@Component({
  selector: 'app-books-list',
  imports: [],
  templateUrl: './books-list.component.html',
  styleUrl: './books-list.component.css'
})
export class BooksListComponent {
  private readonly _bookService = inject(BookService);
  Books: IBookInterface[] = [];

  ngOnInit(){
    this._bookService.getBooks().subscribe(
    (response) => {
      console.log("API RESPONSE => ", response.data);
      this.Books = response.data;
    console.log("BOOKS SETADO =>", this.Books);}
    );
  }

  checkAndConvertStatus(status:number): string{
    const result: {[key: number]: string} ={
      1: "INDISPONÍVEL",
      2: "DISPONÍVEL"
    };

    return result[status] ?? "";
  }
}


