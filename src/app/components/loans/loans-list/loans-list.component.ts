import { Component, inject } from '@angular/core';
import { BookLoanNavComponent } from '../../book-loan-nav/book-loan-nav.component';
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
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loans-list',
  imports: [BookLoanNavComponent, CommonModule],
  templateUrl: './loans-list.component.html',
  styleUrl: './loans-list.component.css',
})
export class LoansListComponent {
  private readonly _loanService = inject(LoanService);
  Loans: ILoan[] = [];
  private dialog = inject(MatDialog);
  private search$ = new Subject<string>();
  private snackBar = inject(MatSnackBar);

  page = 1;
  size = 10;
  totalRecords = 0;
  pages: number[] = [];
  currentSearch = '';

  ngOnInit(): void {
    this.search$
      .pipe(debounceTime(150), distinctUntilChanged())
      .subscribe((search) => {
        this.page = 1;
        this.loadLoans(search);
      });

    this.search$.next('');
  }

  get totalPages(): number {
    const total = Number(this.totalRecords);
    const size = Number(this.size);

    if (!size || size <= 0) return 1;
    if (!total || total <= 0) return 1;

    return Math.max(1, Math.ceil(total / size));
  }

  loadLoans(search: string) {
    this.currentSearch = search;

    this._loanService
      .getLoans(search, this.page, this.size)
      .subscribe((response: any) => {
        const d = response.data;

        this.Loans = d.items ?? d.Items ?? [];

        this.totalRecords = Number(d.totalRecords ?? d.TotalRecords ?? 0);

        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

        if (this.page > this.totalPages) {
          this.page = this.totalPages;
        }
      });
  }

  onSearch(value: string) {
    this.page = 1;
    this.search$.next(value);
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadLoans(this.currentSearch);
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadLoans(this.currentSearch);
    }
  }

  openMarkAsReturnedModal(id: number) {
    const dialogRef = this.dialog.open(ModalConfimationComponent, {
      disableClose: true,
      width: '420px',
      maxWidth: '95vw',
      autoFocus: false,
      enterAnimationDuration: '250ms',
      exitAnimationDuration: '150ms',
      data: {
        title: 'Confirmar retorno',
        message:
          'Tem certeza que deseja marcar esse empréstimo como devolvido?',
        confirmText: 'Devolver',
        cancelText: 'Cancelar',
        titleColor: 'text-success',
        icon: 'fa-check-circle',
        iconColor: 'text-success',
        textColor: 'text-light',
        bgColor: 'bg-success-subtle',
        btnBgColor: 'bg-success',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed === true) {
        this._loanService.markAsReturned(id).subscribe({
          next: () => {
            this.snackBar.openFromComponent(SuccessSnackbarComponent, {
              data: { message: 'Empréstimo devolvido com sucesso!' },
              duration: 4000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              panelClass: ['custom-snackbar'],
            });
            this.loadLoans('');
          },
        });
      }
    });
  }

  openLoanDetailsModal(id: number) {
    this.dialog.open(LoanDetailsComponent, {
      data: { id: id },
      disableClose: true,
      width: '520px',
      maxWidth: '95vw',
      autoFocus: false,
      enterAnimationDuration: '250ms',
      exitAnimationDuration: '150ms',
    });
  }

  openAddLoanModal() {
    const dialogRef = this.dialog.open(LoansAddComponent, {
      disableClose: true,
      width: '520px',
      maxWidth: '95vw',
      autoFocus: false,
      enterAnimationDuration: '250ms',
      exitAnimationDuration: '150ms',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.loadLoans('');
      }
    });
  }

  openEditLoanModal(id: number) {
    const dialogRef = this.dialog.open(LoansEditComponent, {
      data: { id },
      disableClose: true,
      width: '520px',
      maxWidth: '95vw',
      autoFocus: false,
      enterAnimationDuration: '250ms',
      exitAnimationDuration: '150ms',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.loadLoans('');
      }
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
        btnBgColor: 'bg-danger',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed === true) {
        this._loanService.deleteLoan(id).subscribe({
          next: () => {
            this.snackBar.openFromComponent(SuccessSnackbarComponent, {
              data: { message: 'Empréstimo deletado com sucesso!' },
              duration: 4000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              panelClass: ['custom-snackbar'],
            });
            this.loadLoans('');
          },
          error: (err) => {
            const message =
              err?.error?.message || 'Não foi possível excluir o empréstimo.';

            this.snackBar.open(message, 'Fechar', {
              duration: 5000,
              panelClass: ['snackbar-error'],
            });
          },
        });
        if (this.page > 1 && this.Loans.length === 1) {
          this.page--;
        }

        this.loadLoans(this.currentSearch);
      }
    });
  }
}
