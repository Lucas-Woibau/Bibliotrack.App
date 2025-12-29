import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ILoan } from '../models/ILoan';
import { Observable } from 'rxjs';
import { ILoanDetails } from '../models/ILoanDetails';
import { ILoanUpdateInput } from '../models/ILoanUpdateInput';
import { ILoanAddInput } from '../models/ILoanAddInput';

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

  addLoan(loan: Partial<ILoanAddInput>): Observable<{data:ILoanAddInput}>{
    return this._httpClient.post<{data: ILoanAddInput}>(`${this.apiUrl}/loans/`, loan);
  }

  updateLoan(idLoan: number, payload: ILoanUpdateInput) {
    return this._httpClient.put(`${this.apiUrl}/loans/${idLoan}`, payload);
  }

  deleteLoan(id:number): Observable<void>{
    return this._httpClient.delete<void>(`${this.apiUrl}/loans/${id}`);
  }
}
