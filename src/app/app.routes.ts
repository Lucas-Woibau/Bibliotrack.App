import { Routes } from '@angular/router';
import { BooksListComponent } from './components/books/books-list/books-list.component';
import { BooksAddComponent } from './components/books/books-add/books-add.component';
import { BooksEditComponent } from './components/books/books-edit/books-edit.component';

export const routes: Routes = [
  {path: '', component: BooksListComponent},
  {path: 'books', component: BooksListComponent},
  {path: 'books-add', component: BooksAddComponent},
  {path: 'books-edit', component: BooksEditComponent},
];
