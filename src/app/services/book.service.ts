import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IBookInterface } from '../interfaces/IBookInterface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private readonly _httpClient = inject(HttpClient);
  readonly apiUrl = 'https://localhost:7251/api/';

  getBooks(): Observable<{data:IBookInterface[]}>{
    return this._httpClient.get<{data: IBookInterface[]}>(this.apiUrl + "books");
  }
}
