export interface IBook {
  id:number,
  title:string,
  author?:string,
  description?:string,
  quantity?: number,
  registrationCode?:string,
  registrationDateShort?: string | null,
  catalog?:string,
  status: string
}
