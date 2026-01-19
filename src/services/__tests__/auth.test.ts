import { describe, it, expect } from 'vitest';
import { authService } from '../auth';
import { mockUser, mockAuthResponse } from '@/test/mocks/handlers';

describe('authService', () => {
  describe('register', () => {
    it('registers a new user successfully', async () => {
      const registerData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const result = await authService.register(registerData);

      expect(result).toEqual(mockUser);
      expect(result.email).toBe('test@example.com');
    });
  });

  describe('login', () => {
    it('logs in user and returns auth response', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await authService.login(loginData);

      expect(result).toEqual(mockAuthResponse);
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.user).toEqual(mockUser);
    });
  });

  describe('refresh', () => {
    it('refreshes tokens successfully', async () => {
      const result = await authService.refresh({
        refreshToken: 'old-refresh-token',
      });

      expect(result).toEqual(mockAuthResponse);
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });
  });

  describe('logout', () => {
    it('logs out user successfully', async () => {
      // Should not throw
      await expect(
        authService.logout('mock-refresh-token')
      ).resolves.toBeUndefined();
    });
  });

  describe('getMe', () => {
    it('returns current user', async () => {
      const result = await authService.getMe();

      expect(result).toEqual(mockUser);
      expect(result.id).toBe('user-1');
      expect(result.email).toBe('test@example.com');
    });
  });
});
