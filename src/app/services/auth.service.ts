import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  data: {
    token: string;
  };
  isSuccess: boolean;
  message?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _httpClient = inject(HttpClient);
  readonly apiUrl = 'https://localhost:7251/api';
  private readonly TOKEN_KEY = 'token';

  login(payload: { email: string; password: string }) {
    return this._httpClient
      .post<LoginResponse>(`${this.apiUrl}/users/login`, payload)
      .pipe(
        tap((response) => {
          if (response.isSuccess) {
            localStorage.setItem(this.TOKEN_KEY, response.data.token);
          }
        }),
      );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
