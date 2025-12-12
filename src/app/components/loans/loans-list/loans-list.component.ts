import { Component, inject } from '@angular/core';
import { BookLoanNavComponent } from "../../book-loan-nav/book-loan-nav.component";
import { LoanService } from '../../../services/loan.service';
import { ILoanInterface } from '../../../interfaces/ILoanInterface';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoanDetailsComponent } from '../loan-details/loan-details.component';

@Component({
  selector: 'app-loans-list',
  imports: [BookLoanNavComponent],
  templateUrl: './loans-list.component.html',
  styleUrl: './loans-list.component.css'
})
export class LoansListComponent {
  private readonly _loanService = inject(LoanService)
  Loans: ILoanInterface[]=[];
  private dialog = inject(MatDialog)

  ngOnInit(){
    this._loanService.getLoans().subscribe(
    (response) => {
      console.log("API RESPONSE => ", response.data);
      this.Loans = response.data;
    console.log("BOOKS SETADO =>", this.Loans);
  });
  }

  protected openDetailsModal(loan: any){
    this.dialog.open(LoanDetailsComponent,{
      data: loan
    });
  }
}
