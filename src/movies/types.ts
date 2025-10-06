export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page?: number;
  limit?: number;
  pages?: number;
}

export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;
