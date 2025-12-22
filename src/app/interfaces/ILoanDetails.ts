export interface ILoanDetails {
  id: number,
  bookTitle: string,
  personName: string,
  loanDateShort?: string,
  expectedReturnBookDateShort?: string,
  returnDateShort?: string,
  status: string
}
