export interface IBookInterface {
  id:number,
  title:string,
  author?:string,
  description?:string,
  quantity: number,
  registrationDate: Date,
  registrationDateShort: string,
  catalog?:string,
  status: string
}
