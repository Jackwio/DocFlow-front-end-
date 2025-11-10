/**
 * API response and error types
 */

/**
 * Paginated API response wrapper
 */
export interface PagedResultDto<T> {
  totalCount: number;
  items: T[];
}

/**
 * Standard API error response
 */
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Typed error codes
 */
export enum ApiErrorCode {
  ValidationError = 'ValidationError',
  Unauthorized = 'Unauthorized',
  NotFound = 'NotFound',
  TooManyRequests = 'TooManyRequests',
  InternalServerError = 'InternalServerError',
}

/**
 * Client-side error wrapper
 */
export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
