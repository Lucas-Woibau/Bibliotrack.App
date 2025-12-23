export interface ILoan {
  id: number,
  idBook: number,
  bookTitle: string,
  personName: string,
  loanDateShort?: string,
  expectedReturnBookDateShort?: string,
  returnDateShort?: string,
  status: string
}
