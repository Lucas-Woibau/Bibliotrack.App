import { Component, inject } from '@angular/core';
import { LoanService } from '../../../services/loan.service';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { parseDateToIso } from '../../../utils/data.utils';
import { SuccessSnackbarComponent } from '../../snackbar-messages/snackbar-success/success-snackbar.component';
import { ErrorSnackbarComponent } from '../../snackbar-messages/snackbar-error/error-snackbar.component';
import { NgxMaskDirective } from 'ngx-mask';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BookService } from '../../../services/book.service';
import { IBook } from '../../../models/IBook';
import { ILoan } from '../../../models/ILoan';

@Component({
  selector: 'app-loans-add',
  imports: [ReactiveFormsModule, NgxMaskDirective, NgbModule],
  templateUrl: './loans-add.component.html',
  styleUrl: './loans-add.component.css'
})
export class LoansAddComponent{
  private readonly _loanService = inject(LoanService);
  private readonly _bookService = inject(BookService);
  private readonly fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  books: IBook[] = [];
  filteredBooks: IBook[] = [];

  bookSearchControl = new FormControl('');
  showDropdown = false;

  constructor(
    public dialogRef: MatDialogRef<LoansAddComponent>
  ) { }

  loanForm = this.fb.group({
    idBook: this.fb.control<number | null>(null, Validators.required),
    personName: ['', Validators.required],
    loanDate: ['', Validators.required],
    expectedReturnBook: [''],
  });

  ngOnInit(){
    this.loadBooks('');

    this.bookSearchControl.valueChanges.subscribe(value => {
    const search = value?.toLowerCase() || '';

    this.filteredBooks = this.books.filter(book =>
      book.title.toLowerCase().includes(search)
    );
  });
  }

  addLoan(){
      if(this.loanForm.invalid) return;

      const newLoan = {
        idBook: this.loanForm.get('idBook')?.value,
        personName: this.loanForm.get('personName')?.value,
        loanDate: parseDateToIso(
          this.loanForm.get('loanDate')?.value ?? null),
        expectedReturnBook: parseDateToIso(
          this.loanForm.get('expectedReturnBook')?.value ?? null),
      }
      console.log(newLoan);
      this._loanService.addLoan(newLoan as Partial<ILoan>).subscribe({
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

  loadBooks(search:string){
    this._bookService.getBooksToLoan(search).subscribe(
    (response) => {
      this.books = response.data;
      this.filteredBooks = response.data;}
    );
  }

  openDropdown() {
    this.showDropdown = true;
  }

  selectBook(book: IBook) {
    this.bookSearchControl.setValue(book.title, { emitEvent: false });
    this.loanForm.patchValue({ idBook: book.id });
    this.showDropdown = false;
  }
}
