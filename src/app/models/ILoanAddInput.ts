export interface ILoanAddInput {
  idLoan: number,
  idBook: number,
  bookTitle: string,
  personName: string,
  loanDateShort?: string | null,
  expectedReturnBookDateShort?: string | null,
  returnDateShort?: string | null,
}
