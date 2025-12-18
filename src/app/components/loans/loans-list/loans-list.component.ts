import { Component, inject } from '@angular/core';
import { BookLoanNavComponent } from "../../book-loan-nav/book-loan-nav.component";
import { LoanService } from '../../../services/loan.service';
import { ILoan } from '../../../interfaces/ILoan';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoanDetailsComponent } from '../loan-details/loan-details.component';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-loans-list',
  imports: [BookLoanNavComponent],
  templateUrl: './loans-list.component.html',
  styleUrl: './loans-list.component.css'
})
export class LoansListComponent {
  private readonly _loanService = inject(LoanService);
  Loans: ILoan[]=[];
  private dialog = inject(MatDialog);
  private search$ = new Subject<string>();

  ngOnInit(): void{
    this.loadLoans('');

    this.search$.pipe(
      debounceTime(100),
      distinctUntilChanged()
    ).subscribe(search => this.loadLoans(search));

    this.search$.next('');
  }

  loadLoans(search: string){
    this._loanService.getLoans(search).subscribe(
    (response) => {
      this.Loans = response.data;
  });
  }

  onSearch(value:string){
    this.search$.next(value);
  }

  openDetailsModal(id: number){
    this.dialog.open(LoanDetailsComponent,{
      data: { id: id },
      disableClose: true,
      width: '520px',
      maxWidth: '95vw',
      autoFocus: false,
      enterAnimationDuration: '250ms',
      exitAnimationDuration: '150ms'
    });
  }
}
