export interface PagingInfo<T> {
  content: T[];
  first?: boolean;
  last?: boolean;
  pageable?: Pageable;
  totalPages: number;
  totalElements?: number;
}

export interface Pageable {
  pageSize: number;
  pageNumber: number;
}
