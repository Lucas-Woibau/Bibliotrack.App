export interface PagedResult<T> {
  items: T[];
  page: number;
  size: number;
  totalRecords: number;
}
