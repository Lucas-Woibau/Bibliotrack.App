import { Component, inject } from '@angular/core';
import { BookLoanNavComponent } from "../../book-loan-nav/book-loan-nav.component";
import { LoanService } from '../../../services/loan.service';
import { ILoan } from '../../../models/ILoan';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoanDetailsComponent } from '../loan-details/loan-details.component';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { LoansAddComponent } from '../loans-add/loans-add.component';
import { LoansEditComponent } from '../loans-edit/loans-edit.component';
import { ModalConfimationComponent } from '../../modal-confimation/modal-confimation.component';
import { SuccessSnackbarComponent } from '../../snackbar-messages/snackbar-success/success-snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  private snackBar = inject(MatSnackBar);

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

  openMarkAsReturnedModal(id: number){
    const dialogRef = this.dialog.open(ModalConfimationComponent, {
      disableClose: true,
      width: '420px',
      maxWidth: '95vw',
      autoFocus: false,
      enterAnimationDuration: '250ms',
      exitAnimationDuration: '150ms',
      data: {
        title: 'Confirmar retorno',
        message: 'Tem certeza que deseja marcar esse empréstimo como devolvido?',
        confirmText: 'Devolver',
        cancelText: 'Cancelar',
        titleColor: 'text-success',
        icon: 'fa-check-circle',
        iconColor: 'text-success',
        textColor: 'text-light',
        bgColor: 'bg-success-subtle',
        btnBgColor: 'bg-success'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed === true) {
        this._loanService.markAsReturned(id).subscribe({
          next: () => {
            this.snackBar.openFromComponent(SuccessSnackbarComponent, {
              data: {message: 'Empréstimo devolvido com sucesso!'},
              duration: 4000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              panelClass: ['custom-snackbar']
            });
            this.loadLoans('');
          }
        });
      }
    });
  }

  openLoanDetailsModal(id: number){
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

  openAddLoanModal(){
    const dialogRef = this.dialog.open(LoansAddComponent,{
      disableClose: true,
      width: '520px',
      maxWidth: '95vw',
      autoFocus: false,
      enterAnimationDuration: '250ms',
      exitAnimationDuration: '150ms'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        this.loadLoans('');
      };
    });
  }

  openEditLoanModal(id: number){
    const dialogRef = this.dialog.open(LoansEditComponent,{
      data: { id },
      disableClose: true,
      width: '520px',
      maxWidth: '95vw',
      autoFocus: false,
      enterAnimationDuration: '250ms',
      exitAnimationDuration: '150ms'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        this.loadLoans('');
      };
    });
  }

  openDeleteLoanModal(id: number) {
    const dialogRef = this.dialog.open(ModalConfimationComponent, {
      disableClose: true,
      width: '420px',
      maxWidth: '95vw',
      autoFocus: false,
      enterAnimationDuration: '250ms',
      exitAnimationDuration: '150ms',
      data: {
        title: 'Confirmar exclusão',
        message: 'Tem certeza que deseja excluir esse empréstimo?',
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        titleColor: 'text-danger',
        icon: 'fa-trash-can',
        iconColor: 'text-danger',
        textColor: 'text-light',
        bgColor: 'bg-danger-subtle',
        btnBgColor: 'bg-danger'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed === true) {
        this._loanService.deleteLoan(id).subscribe({
          next: () => {
            this.snackBar.openFromComponent(SuccessSnackbarComponent, {
              data: {message: 'Empréstimo deletado com sucesso!'},
              duration: 4000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              panelClass: ['custom-snackbar']
            });
            this.loadLoans('');
          }
        });
      }
    });
  }
}
