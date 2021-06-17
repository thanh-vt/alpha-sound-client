export interface PagingInfo<T> {
  content: T[];
  first: boolean;
  last: boolean;
  pageable: Pageable;
  totalPages: number;
}

export interface Pageable {
  pageSize: number;
  pageNumber: number;
}
