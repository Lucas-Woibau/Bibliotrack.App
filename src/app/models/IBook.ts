export interface IBook {
  id:number,
  title:string,
  author?:string,
  description?:string,
  quantity?: number,
  registrationNumber?:number,
  registrationDateShort?: string | null,
  catalog?:string,
  status: string
}
