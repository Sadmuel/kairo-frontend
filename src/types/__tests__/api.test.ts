import { describe, it, expect } from 'vitest';
import { isApiErrorResponse } from '../api';

describe('api types', () => {
  describe('isApiErrorResponse', () => {
    it('returns true for valid API error response', () => {
      expect(isApiErrorResponse({ message: 'Error occurred' })).toBe(true);
    });

    it('returns true for API error with optional fields', () => {
      expect(
        isApiErrorResponse({
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          errors: { email: ['Invalid email'] },
        })
      ).toBe(true);
    });

    it('returns false for null', () => {
      expect(isApiErrorResponse(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isApiErrorResponse(undefined)).toBe(false);
    });

    it('returns false for non-objects', () => {
      expect(isApiErrorResponse('string')).toBe(false);
      expect(isApiErrorResponse(123)).toBe(false);
      expect(isApiErrorResponse(true)).toBe(false);
    });

    it('returns false for object without message', () => {
      expect(isApiErrorResponse({ error: 'Something' })).toBe(false);
      expect(isApiErrorResponse({})).toBe(false);
    });

    it('returns false for object with non-string message', () => {
      expect(isApiErrorResponse({ message: 123 })).toBe(false);
      expect(isApiErrorResponse({ message: null })).toBe(false);
      expect(isApiErrorResponse({ message: { nested: 'value' } })).toBe(false);
    });
  });
});
