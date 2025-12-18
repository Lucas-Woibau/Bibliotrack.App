import { Component, inject } from '@angular/core';
import { BookService } from '../../../services/book.service';
import { IBook } from '../../../interfaces/IBook';
import { BookLoanNavComponent } from "../../book-loan-nav/book-loan-nav.component";
import { MatDialog } from '@angular/material/dialog';
import { BookDetailsComponent } from '../book-details/book-details.component';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

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


