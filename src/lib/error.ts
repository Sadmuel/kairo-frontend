import { AxiosError } from 'axios';
import { isApiErrorResponse } from '@/types';

/**
 * Extracts a user-friendly error message from an error object.
 * Handles Axios errors with backend messages, and falls back to a default message.
 *
 * Expects backend errors to follow the ApiErrorResponse contract:
 * { message: string, code?: string, errors?: Record<string, string[]> }
 */
export function getErrorMessage(
  error: unknown,
  fallback = 'An unexpected error occurred'
): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data;
    if (isApiErrorResponse(data)) {
      return data.message;
    }
    return fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}