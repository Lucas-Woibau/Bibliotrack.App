import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  data: {
    token: string;
  };
  errors?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _httpClient = inject(HttpClient);
  readonly apiUrl = 'https://localhost:7251/api';

  login(request: LoginRequest): Observable<LoginResponse> {
    return this._httpClient
      .post<LoginResponse>(`${this.apiUrl}/users/login`, request)
      .pipe(
        tap((response) => {
          if (response.success) {
            localStorage.setItem('token', response.data.token);
          }
        }),
      );
  }

  logout() {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
