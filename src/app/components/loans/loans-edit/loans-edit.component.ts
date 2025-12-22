import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { LoanService } from '../../../services/loan.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorSnackbarComponent } from '../../snackbar-messages/snackbar-error/error-snackbar.component';

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
      bookTitle: [``, Validators.required],
      personName: [``],
      loanDate: [``],
      expectedReturnBookDate: [``],
      returnDate: [``]
    });
  }

  loadLoan(){
    this._loanService.getLoanById(this.loanId).subscribe({
      next: (res) =>{
        this.loanForm.patchValue({
          bookTitle: res.data.bookTitle,
          personName: res.data.personName,
          loanDate: res.data.loanDateShort,
          expectedReturnBookDate: res.data.expectedReturnBookDateShort,
          returnDate: res.data.returnDateShort
      });
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

  saveBook() {
    if (this.loanForm.invalid) return;

    const updatedBook = {
      idBook: Number(this.loanId),
      title: this.loanForm.get('title')?.value,
    };

    this._bookService.updateBook(updatedBook).subscribe({
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
}
