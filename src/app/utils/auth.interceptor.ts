import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();
  const router = inject(Router);
  const isApi = req.url.includes('/api/');

  const authReq =
    token && isApi
      ? req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }})
      : req;

  return next(authReq).pipe(
    catchError((error) => {
      if(isApi && (error.status === 401 || error.status === 403)) {
        auth.logout();
        router.navigate(['/login']);
      }

  return throwError(() => error);
    })
  );
};
