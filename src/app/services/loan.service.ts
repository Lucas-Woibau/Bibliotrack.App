import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ILoan } from '../models/ILoan';
import { Observable } from 'rxjs';
import { PagedResult } from '../models/PagedResult';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  private readonly _httpClient = inject(HttpClient);
  readonly apiUrl = '/api';

  getLoans(
    search = '',
    page = 1,
    size = 10,
  ): Observable<{ data: PagedResult<ILoan> }> {
    return this._httpClient.get<{ data: PagedResult<ILoan> }>(
      `${this.apiUrl}/loans`,
      {
        params: { search, page, size },
      },
    );
  }

  getLoanById(id: number): Observable<{ data: ILoan }> {
    return this._httpClient.get<{ data: ILoan }>(`${this.apiUrl}/loans/${id}`);
  }

  addLoan(loan: Partial<ILoan>): Observable<{ data: ILoan }> {
    return this._httpClient.post<{ data: ILoan }>(
      `${this.apiUrl}/loans/`,
      loan,
    );
  }

  updateLoan(loan: { idLoan: number & Partial<ILoan> }) {
    return this._httpClient.put(`${this.apiUrl}/loans/${loan.idLoan}`, loan);
  }

  deleteLoan(id: number): Observable<void> {
    return this._httpClient.delete<void>(`${this.apiUrl}/loans/${id}`);
  }

  markAsReturned(id: number): Observable<void> {
    return this._httpClient.put<void>(`${this.apiUrl}/loans/${id}/return`, {});
  }
}
