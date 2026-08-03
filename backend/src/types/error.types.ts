/**
 * Error response type definitions
 */

/**
 * Validation error details
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Standardized error response
 */
export interface ErrorDetails {
  success: false;
  message: string;
  errors?: ValidationError[];
  status?: number;
}

/**
 * Success response for type safety
 */
export interface SuccessResponse<T = unknown> {
  success: true;
  message?: string;
  data?: T;
  status?: number;
}

/**
 * API response that can be either success or error
 */
export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorDetails;
