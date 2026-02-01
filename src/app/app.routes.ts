import { Routes } from '@angular/router';
import { BooksListComponent } from './components/books/books-list/books-list.component';
import { BooksAddComponent } from './components/books/books-add/books-add.component';
import { BooksEditComponent } from './components/books/books-edit/books-edit.component';
import { LoansListComponent } from './components/loans/loans-list/loans-list.component';
import { LoansAddComponent } from './components/loans/loans-add/loans-add.component';
import { LoansEditComponent } from './components/loans/loans-edit/loans-edit.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuardService } from './services/auth-guard.service';
import { guestGuard } from './services/guest-guard.service';

export const routes: Routes = [
  {path: '', redirectTo: '/livros', pathMatch: 'full'},

  {path: 'login', canActivate: [guestGuard], component: LoginComponent},

  {path: 'livros', component: BooksListComponent, canActivate: [AuthGuardService]},
  {path: 'adicionar-livro', component: BooksAddComponent, canActivate: [AuthGuardService]},
  {path: 'editar-livro', component: BooksEditComponent, canActivate: [AuthGuardService]},
  {path: 'emprestimos', component: LoansListComponent, canActivate: [AuthGuardService]},
  {path: 'adicionar-emprestimo', component: LoansAddComponent, canActivate: [AuthGuardService]},
  {path: 'editar-emprestimo', component: LoansEditComponent, canActivate: [AuthGuardService]},

  {path: '**', redirectTo: '/login' }
];
