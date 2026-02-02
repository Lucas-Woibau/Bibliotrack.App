import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-book-loan-nav',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './book-loan-nav.component.html',
  styleUrls: ['./book-loan-nav.component.css']
})
export class BookLoanNavComponent{
  currentUrl = '';

  constructor(private router: Router) {
    this.currentUrl = this.router.url;

     this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        this.currentUrl = this.router.url;
      });
   }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
