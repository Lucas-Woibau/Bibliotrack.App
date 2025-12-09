import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ILoanInterface } from '../interfaces/ILoanInterface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

private readonly _httpClient = inject(HttpClient);
  readonly apiUrl = 'https://localhost:7251/api/';

  getLoans(): Observable<{data:ILoanInterface[]}>{
    return this._httpClient.get<{data: ILoanInterface[]}>(this.apiUrl + "loans");
  }
}
