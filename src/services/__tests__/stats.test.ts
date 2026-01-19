import { describe, it, expect } from 'vitest';
import { statsService } from '../stats';
import { mockOverallStats, mockDayStats, mockWeekStats } from '@/test/mocks/handlers';

describe('statsService', () => {
  describe('getOverall', () => {
    it('fetches overall user statistics', async () => {
      const result = await statsService.getOverall();

      expect(result).toEqual(mockOverallStats);
      expect(result.currentStreak).toBe(5);
      expect(result.longestStreak).toBe(10);
      expect(result.totalCompletedDays).toBe(25);
    });
  });

  describe('getDay', () => {
    it('fetches statistics for a specific day', async () => {
      const result = await statsService.getDay('2024-01-15');

      expect(result).toEqual(mockDayStats);
      expect(result.date).toBe('2024-01-15');
      expect(result.completedTodos).toBe(5);
      expect(result.totalTodos).toBe(8);
    });
  });

  describe('getWeek', () => {
    it('fetches statistics for a week', async () => {
      const result = await statsService.getWeek('2024-01-15');

      expect(result).toEqual(mockWeekStats);
      expect(result.weekStart).toBe('2024-01-08');
      expect(result.weekEnd).toBe('2024-01-14');
      expect(result.completedDays).toBe(5);
    });
  });
});
