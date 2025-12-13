import { AxiosError } from 'axios';

/**
 * Extracts a user-friendly error message from an error object.
 * Handles Axios errors with backend messages, and falls back to a default message.
 */
export function getErrorMessage(
  error: unknown,
  fallback = 'An unexpected error occurred'
): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}