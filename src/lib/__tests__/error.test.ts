import { describe, it, expect } from 'vitest';
import { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getErrorMessage } from '../error';

describe('error utils', () => {
  describe('getErrorMessage', () => {
    it('extracts message from AxiosError with API response', () => {
      const error = new AxiosError('Request failed');
      error.response = {
        data: { message: 'Invalid credentials' },
        status: 401,
        statusText: 'Unauthorized',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };

      expect(getErrorMessage(error)).toBe('Invalid credentials');
    });

    it('returns fallback for AxiosError without valid response', () => {
      const error = new AxiosError('Network error');
      error.response = {
        data: { foo: 'bar' }, // No message field
        status: 500,
        statusText: 'Internal Server Error',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };

      expect(getErrorMessage(error)).toBe('An unexpected error occurred');
    });

    it('returns fallback for AxiosError with no response', () => {
      const error = new AxiosError('Network error');
      // No response property

      expect(getErrorMessage(error)).toBe('An unexpected error occurred');
    });

    it('extracts message from standard Error', () => {
      const error = new Error('Something went wrong');

      expect(getErrorMessage(error)).toBe('Something went wrong');
    });

    it('returns fallback for unknown error types', () => {
      expect(getErrorMessage('string error')).toBe('An unexpected error occurred');
      expect(getErrorMessage(123)).toBe('An unexpected error occurred');
      expect(getErrorMessage(null)).toBe('An unexpected error occurred');
      expect(getErrorMessage(undefined)).toBe('An unexpected error occurred');
      expect(getErrorMessage({ random: 'object' })).toBe('An unexpected error occurred');
    });

    it('uses custom fallback message when provided', () => {
      expect(getErrorMessage('unknown', 'Custom error message')).toBe('Custom error message');
      expect(getErrorMessage(null, 'Failed to load data')).toBe('Failed to load data');
    });

    it('handles AxiosError with null response data', () => {
      const error = new AxiosError('Request failed');
      error.response = {
        data: null,
        status: 500,
        statusText: 'Internal Server Error',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };

      expect(getErrorMessage(error)).toBe('An unexpected error occurred');
    });

    it('handles API error response with additional fields', () => {
      const error = new AxiosError('Request failed');
      error.response = {
        data: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          errors: {
            email: ['Invalid email format'],
            password: ['Password too short'],
          },
        },
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };

      expect(getErrorMessage(error)).toBe('Validation failed');
    });
  });
});
