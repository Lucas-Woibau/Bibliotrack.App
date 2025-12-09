import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-book-loan-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './book-loan-nav.component.html',
  styleUrls: ['./book-loan-nav.component.css']
})
export class BookLoanNavComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
