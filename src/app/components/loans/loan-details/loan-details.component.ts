import { Component, inject, Inject, OnInit } from '@angular/core';
import { BookDetailsComponent } from '../../books/book-details/book-details.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoanService } from '../../../services/loan.service';
import { ILoan } from '../../../models/ILoan';

@Component({
  selector: 'app-loan-details',
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.css']
})
export class LoanDetailsComponent implements OnInit {
  private readonly _loanService = inject(LoanService);
  loan?: ILoan;

  constructor(
    public dialogRef: MatDialogRef<LoanDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) { }

  ngOnInit() {
    this.loadLoan();
  }

  loadLoan(){
  this._loanService.getLoanById(this.data.id).subscribe({
    next: (response) =>{
      this.loan = response.data;
      console.log(this.loan);
    },
    error:(err)=>{
      console.log('Error to load loan', err);
    }
  });
}
}
