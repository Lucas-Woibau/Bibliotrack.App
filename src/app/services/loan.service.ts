import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ILoan } from '../interfaces/ILoan';
import { Observable } from 'rxjs';
import { ILoanDetails } from '../interfaces/ILoanDetails';

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

  getLoanById(id:number):Observable<{data:ILoanDetails}>{
    return this._httpClient.get<{data:ILoanDetails}>(`${this.apiUrl}/loans/${id}`);
  }

  addLoan(loan: Partial<ILoanDetails>): Observable<{data:ILoanDetails}>{
    return this._httpClient.post<{data: ILoanDetails}>(`${this.apiUrl}/loans/`, loan);
  }

  updateLoan(loan: { idLoan: number } & Partial<ILoanDetails>) {
    return this._httpClient.put(`${this.apiUrl}/loans/${loan.idLoan}`,loan);
  }

  deleteLoan(id:number): Observable<void>{
    return this._httpClient.delete<void>(`${this.apiUrl}/loans/${id}`);
  }
}
