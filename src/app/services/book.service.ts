import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IBook } from '../interfaces/IBook';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private readonly _httpClient = inject(HttpClient);
  readonly apiUrl = 'https://localhost:7251/api';

  getBooks(): Observable<{data:IBook[]}>{
    return this._httpClient.get<{data: IBook[]}>(`${this.apiUrl}/books`);
  }
}
