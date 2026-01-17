import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ILoan } from '../models/ILoan';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  private readonly _httpClient = inject(HttpClient);
  readonly apiUrl = 'https://localhost:7251/api';

  getLoans(search?:string): Observable<{data:ILoan[]}>{
    return this._httpClient.get<{data: ILoan[]}>(`${this.apiUrl}/loans`,{
      params: {search: search ?? ''}
    });
  }

  getLoanById(id:number):Observable<{data:ILoan}>{
    return this._httpClient.get<{data:ILoan}>(`${this.apiUrl}/loans/${id}`);
  }

  addLoan(loan: Partial<ILoan>): Observable<{data:ILoan}>{
    return this._httpClient.post<{data: ILoan}>(`${this.apiUrl}/loans/`, loan);
  }

  updateLoan(loan: { idLoan: number & Partial<ILoan>}) {
    return this._httpClient.put(`${this.apiUrl}/loans/${loan.idLoan}`, loan);
  }

  deleteLoan(id:number): Observable<void>{
    return this._httpClient.delete<void>(`${this.apiUrl}/loans/${id}`);
  }

  markAsReturned(id:number): Observable<void>{
    return this._httpClient.put<void>(`${this.apiUrl}/loans/${id}/return`,{});
  }
}
