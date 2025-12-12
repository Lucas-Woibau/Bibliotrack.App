export interface IBook {
  id:number,
  title:string,
  author?:string,
  description?:string,
  quantity: number,
  registrationDateShort: string,
  catalog?:string,
  status: string
}
