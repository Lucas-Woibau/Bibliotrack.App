import { Routes } from '@angular/router';
import { BooksListComponent } from './components/books/books-list/books-list.component';
import { BooksAddComponent } from './components/books/books-add/books-add.component';
import { BooksEditComponent } from './components/books/books-edit/books-edit.component';
import { LoansListComponent } from './components/loans/loans-list/loans-list.component';
import { LoansAddComponent } from './components/loans/loans-add/loans-add.component';
import { LoansEditComponent } from './components/loans/loans-edit/loans-edit.component';

export const routes: Routes = [
  {path: '', redirectTo: '/Livros', pathMatch: 'full'},

  {path: 'Livros', component: BooksListComponent},
  {path: 'AdicionarLivro', component: BooksAddComponent},
  {path: 'EditarLivro', component: BooksEditComponent},

  {path: 'Emprestimos', component: LoansListComponent},
  {path: 'AdicionarEmprestimo', component: LoansAddComponent},
  {path: 'EditarEmprestimo', component: LoansEditComponent}
];
