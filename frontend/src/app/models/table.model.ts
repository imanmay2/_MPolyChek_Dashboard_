export interface TableColumn<T> {
  key: keyof T;
  label: string;
}

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}
