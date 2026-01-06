/**
 * Standard error response structure returned by the backend API.
 *
 * All API endpoints should return errors in this format for consistency.
 * Backend developers: ensure error responses follow this contract.
 */
export interface ApiErrorResponse {
  message: string;
  /** Optional error code for programmatic handling */
  code?: string;
  /** Optional field-level validation errors */
  errors?: Record<string, string[]>;
}

/**
 * Type guard to check if a value matches the ApiErrorResponse structure.
 */
export function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof (value as ApiErrorResponse).message === 'string'
  );
}
