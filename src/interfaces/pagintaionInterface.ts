export interface PaginationResponse<T>{
  page: number;
  pageSize: number;
  total: number;
  data: T[]
}
