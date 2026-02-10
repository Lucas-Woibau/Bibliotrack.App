import { Routes } from '@angular/router';
import { BooksListComponent } from './components/books/books-list/books-list.component';
import { LoansListComponent } from './components/loans/loans-list/loans-list.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuardService } from './services/auth-guard.service';
import { guestGuard } from './services/guest-guard.service';

export const routes: Routes = [
  {path: '', redirectTo: '/livros', pathMatch: 'full'},

  {path: 'login', canActivate: [guestGuard], component: LoginComponent},

  {path: 'livros', component: BooksListComponent, canActivate: [AuthGuardService]},
  {path: 'emprestimos', component: LoansListComponent, canActivate: [AuthGuardService]},

  {path: '**', redirectTo: '/login' }
];
