import { Component, inject } from '@angular/core';
import { LoanService } from '../../../services/loan.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { parseDateToIso } from '../../../utils/data.utils';
import { ILoanAddInput } from '../../../models/ILoanAddInput';
import { SuccessSnackbarComponent } from '../../snackbar-messages/snackbar-success/success-snackbar.component';
import { ErrorSnackbarComponent } from '../../snackbar-messages/snackbar-error/error-snackbar.component';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-loans-add',
  imports: [ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './loans-add.component.html',
  styleUrl: './loans-add.component.css'
})
export class LoansAddComponent{
  private readonly _loanService = inject(LoanService);
  private readonly fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  constructor(
    public dialogRef: MatDialogRef<LoansAddComponent>
  ) { }

  loanForm = this.fb.group({
    bookTitle: ['', Validators.required],
    personName: ['', Validators.required],
    loanDate: [''],
    expectReturnDate: [''],
    returnDate: ['']
  });

  addLoan(){
      if(this.loanForm.invalid) return;

      const newLoan = {
        bookTitle: this.loanForm.get('bookTitle')?.value,
        personName: this.loanForm.get('personName')?.value,
        loanDate: parseDateToIso(
          this.loanForm.get('loanDateShort')?.value ?? null),
        expectedReturnDate: parseDateToIso(
          this.loanForm.get('expectedReturnDate')?.value ?? null),
        returnDate: parseDateToIso(
          this.loanForm.get('returnDate')?.value ?? null)
      }

      this._loanService.addLoan(newLoan as Partial<ILoanAddInput>).subscribe({
        next:() => {
          this.snackBar.openFromComponent(SuccessSnackbarComponent, {
            data: {message: 'Empréstimo adicionado com sucesso!'},
            duration: 4000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['custom-snackbar']
          });

          this.dialogRef.close(true);

        },
        error: err =>{
          this.snackBar.openFromComponent(ErrorSnackbarComponent, {
            data: {message: 'Erro ao salvar o empréstimo.', err},
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['custom-snackbar']
          });
        }
      });
    }
}
