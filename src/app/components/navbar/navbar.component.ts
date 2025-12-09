import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { BooksListComponent } from "../books/books-list/books-list.component";

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, BooksListComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
}
