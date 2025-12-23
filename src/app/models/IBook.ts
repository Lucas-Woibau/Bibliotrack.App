export interface IBook {
  id:number,
  title:string,
  author?:string,
  description?:string,
  quantity?: number,
  registrationDateShort?: string | null,
  catalog?:string,
  status: string
}
