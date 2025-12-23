import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { LoanService } from '../../../services/loan.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorSnackbarComponent } from '../../snackbar-messages/snackbar-error/error-snackbar.component';
import { SuccessSnackbarComponent } from '../../snackbar-messages/snackbar-success/success-snackbar.component';
import { parseDateToIso } from '../../../utils/data.utils';


@Component({
  selector: 'app-loans-edit',
  imports: [ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './loans-edit.component.html',
  styleUrl: './loans-edit.component.css'
})
export class LoansEditComponent implements OnInit{
  private readonly _loanService = inject(LoanService);
  private readonly fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  loanForm!: FormGroup;
  isEdit = false;
  loanId!: number;
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<LoansEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {id:number}
  ) { }

  ngOnInit(): void {
    this.createForm();

    if (this.data?.id) {
      this.isEdit = true;
      this.loanId = this.data.id;
      this.loadLoan();
    }
  }

  createForm(){
    this.loanForm = this.fb.group({
      idBook: [``],
      bookTitle: [``, Validators.required],
      personName: [``],
      loanDateShort: [``],
      expectedReturnBookDateShort: [``],
      returnDateShort: [``],
    });
  }

  loadLoan(){
    this._loanService.getLoanById(this.loanId).subscribe({
      next: (res) =>{
        this.loanForm.patchValue({
          idBook: res.data.idBook,
          bookTitle: res.data.bookTitle,
          personName: res.data.personName,
          loanDateShort: res.data.loanDateShort,
          expectedReturnBookDateShort: res.data.expectedReturnBookDateShort,
          returnDateShort: res.data.returnDateShort,
      });
      console.log(res.data);

      },
      error: () => {
        this.snackBar.openFromComponent(ErrorSnackbarComponent, {
          data: {message: 'Erro ao carregar o empréstimo.'},
          duration: 5000
        });
        this.dialogRef.close();
      }
    });
  }

  saveLoan() {
    if (this.loanForm.invalid) return;

    const payload = {
      idLoan: this.loanId,
      idBook: this.loanForm.value.idBook,
      bookTitle: this.loanForm.value.bookTitle,
      personName: this.loanForm.value.personName,

      loanDate: parseDateToIso(this.loanForm.value.loanDateShort),
      expectedReturnBook: parseDateToIso(this.loanForm.value.expectedReturnBookDateShort),
      returnDate: parseDateToIso(this.loanForm.value.returnDateShort)
};

    console.log(payload);
    this._loanService.updateLoan(this.loanId, payload).subscribe({
    next: () => {
      this.snackBar.openFromComponent(SuccessSnackbarComponent, {
        data: { message: 'Livro atualizado com sucesso!' },
        duration: 4000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        panelClass: ['custom-snackbar']
      });

      this.dialogRef.close(true);
    },

    error: err => {
      console.error(err);

      this.snackBar.openFromComponent(ErrorSnackbarComponent, {
        data: {
          message: 'Erro ao atualizar o livro.',
          err
        },
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        panelClass: ['custom-snackbar']
      });
    }
  });
  }

  cancel() {
    this.dialogRef.close(false);
  }

}
