import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IBook } from '../models/IBook';
import { Observable } from 'rxjs';
import { PagedResult } from '../models/PagedResult';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private readonly _httpClient = inject(HttpClient);
  readonly apiUrl = '/api';

  getBooks(
    search = '',
    page = 1,
    size = 10,
  ): Observable<{ data: PagedResult<IBook> }> {
    return this._httpClient.get<{ data: PagedResult<IBook> }>(
      `${this.apiUrl}/books`,
      {
        params: { search, page, size },
      },
    );
  }

  getBookById(id: number): Observable<{ data: IBook }> {
    return this._httpClient.get<{ data: IBook }>(`${this.apiUrl}/books/${id}`);
  }

  getBooksToLoan(search = ''): Observable<{ data: IBook[] }> {
    return this._httpClient.get<{ data: IBook[] }>(
      `${this.apiUrl}/books/books-to-loan`,
      {
        params: { search },
      },
    );
  }

  addBook(book: Partial<IBook>): Observable<{ data: IBook }> {
    return this._httpClient.post<{ data: IBook }>(
      `${this.apiUrl}/books/`,
      book,
    );
  }

  updateBook(book: { idBook: number } & Partial<IBook>) {
    return this._httpClient.put(`${this.apiUrl}/books/${book.idBook}`, book);
  }

  deleteBook(id: number): Observable<void> {
    return this._httpClient.delete<void>(`${this.apiUrl}/books/${id}`);
  }
}
