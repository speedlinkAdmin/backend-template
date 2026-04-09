export interface ApiResponse<T> {
  status: 'success' | 'fail' | 'error';
  data: T;
  message?: string;
}

export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  status: 'error';
  message: string;
  stack?: string;
}
