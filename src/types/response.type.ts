/**
 * Standard API Response Structure
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: ErrorDetails;
  metadata?: ResponseMetadata;
  timestamp: string;
}

/**
 * Error Details Structure
 */
export interface ErrorDetails {
  code: string;
  message: string;
  details?: any;
  stack?: string; // Only in development
}

/**
 * Pagination Metadata
 */
export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Response Metadata
 */
export interface ResponseMetadata {
  pagination?: PaginationMetadata;
  requestId?: string;
  processingTime?: number;
  version?: string;
}