import { Routes } from '@angular/router';
import { BooksListComponent } from './components/books/books-list/books-list.component';
import { BooksAddComponent } from './components/books/books-add/books-add.component';
import { BooksEditComponent } from './components/books/books-edit/books-edit.component';
import { LoansListComponent } from './components/loans/loans-list/loans-list.component';
import { LoansAddComponent } from './components/loans/loans-add/loans-add.component';
import { LoansEditComponent } from './components/loans/loans-edit/loans-edit.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuardService } from './services/auth-guard.service';

export const routes: Routes = [
  {path: '', redirectTo: '/Livros', pathMatch: 'full'},

  {path: 'Login', component: LoginComponent},

  {path: 'Livros', component: BooksListComponent, canActivate: [AuthGuardService]},
  {path: 'AdicionarLivro', component: BooksAddComponent, canActivate: [AuthGuardService]},
  {path: 'EditarLivro', component: BooksEditComponent, canActivate: [AuthGuardService]},

  {path: 'Emprestimos', component: LoansListComponent, canActivate: [AuthGuardService]},
  {path: 'AdicionarEmprestimo', component: LoansAddComponent, canActivate: [AuthGuardService]},
  {path: 'EditarEmprestimo', component: LoansEditComponent, canActivate: [AuthGuardService]},

  {path: '**', redirectTo: '/Login' }
];
