import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IBook } from '../models/IBook';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private readonly _httpClient = inject(HttpClient);
  readonly apiUrl = 'https://localhost:7251/api';

  getBooks(search = ''): Observable<{data:IBook[]}>{
    return this._httpClient.get<{data: IBook[]}>(`${this.apiUrl}/books`, {
      params: {search}
    });
  }

  getBookById(id:number):Observable<{data:IBook}>{
    return this._httpClient.get<{data:IBook}>(`${this.apiUrl}/books/${id}`);
  }

  addBook(book: Partial<IBook>): Observable<{data:IBook}>{
    return this._httpClient.post<{data: IBook}>(`${this.apiUrl}/books/`, book);
  }

  updateBook(book: { idBook: number } & Partial<IBook>) {
  return this._httpClient.put(`${this.apiUrl}/books/${book.idBook}`,book);
  }

  deleteBook(id:number): Observable<void>{
    return this._httpClient.delete<void>(`${this.apiUrl}/books/${id}`);
  }
}
