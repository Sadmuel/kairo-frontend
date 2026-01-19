import { describe, it, expect } from 'vitest';
import {
  formatDateForApi,
  formatDateDisplay,
  getMonthViewDays,
  getWeekDays,
  formatTime,
  getTimeBlockPosition,
} from '../date-utils';

describe('date-utils', () => {
  describe('formatDateForApi', () => {
    it('formats date to YYYY-MM-DD format', () => {
      const date = new Date(2024, 0, 15); // January 15, 2024
      expect(formatDateForApi(date)).toBe('2024-01-15');
    });

    it('pads single digit months and days', () => {
      const date = new Date(2024, 0, 5); // January 5, 2024
      expect(formatDateForApi(date)).toBe('2024-01-05');
    });

    it('handles December correctly', () => {
      const date = new Date(2024, 11, 31); // December 31, 2024
      expect(formatDateForApi(date)).toBe('2024-12-31');
    });
  });

  describe('formatDateDisplay', () => {
    it('formats date with custom format string', () => {
      const date = new Date(2024, 0, 15);
      expect(formatDateDisplay(date, 'MMMM d, yyyy')).toBe('January 15, 2024');
    });

    it('formats date with short format', () => {
      const date = new Date(2024, 0, 15);
      expect(formatDateDisplay(date, 'MMM d')).toBe('Jan 15');
    });

    it('formats date with weekday', () => {
      const date = new Date(2024, 0, 15); // Monday
      expect(formatDateDisplay(date, 'EEEE')).toBe('Monday');
    });
  });

  describe('getMonthViewDays', () => {
    it('returns all days visible in a month view including padding', () => {
      // January 2024 starts on Monday, ends on Wednesday
      const date = new Date(2024, 0, 15);
      const days = getMonthViewDays(date);

      // Should include padding from previous month (Sunday before) to next month (Saturday after)
      expect(days.length).toBeGreaterThanOrEqual(28);
      expect(days.length).toBeLessThanOrEqual(42);

      // First day should be a Sunday (start of week)
      expect(days[0].getDay()).toBe(0);

      // Last day should be a Saturday (end of week)
      expect(days[days.length - 1].getDay()).toBe(6);
    });

    it('includes all days of the month', () => {
      const date = new Date(2024, 0, 15);
      const days = getMonthViewDays(date);

      // Check that January 1 and January 31 are included
      const hasJan1 = days.some(
        (d) => d.getMonth() === 0 && d.getDate() === 1
      );
      const hasJan31 = days.some(
        (d) => d.getMonth() === 0 && d.getDate() === 31
      );

      expect(hasJan1).toBe(true);
      expect(hasJan31).toBe(true);
    });
  });

  describe('getWeekDays', () => {
    it('returns 7 days starting from Sunday', () => {
      const date = new Date(2024, 0, 15); // Monday
      const days = getWeekDays(date);

      expect(days).toHaveLength(7);
      expect(days[0].getDay()).toBe(0); // Sunday
      expect(days[6].getDay()).toBe(6); // Saturday
    });

    it('includes the given date in the week', () => {
      const date = new Date(2024, 0, 15);
      const days = getWeekDays(date);

      const hasDate = days.some(
        (d) => d.getDate() === 15 && d.getMonth() === 0
      );
      expect(hasDate).toBe(true);
    });

    it('returns consecutive days', () => {
      const date = new Date(2024, 0, 15);
      const days = getWeekDays(date);

      for (let i = 1; i < days.length; i++) {
        const diff = days[i].getTime() - days[i - 1].getTime();
        expect(diff).toBe(24 * 60 * 60 * 1000); // 1 day in ms
      }
    });
  });

  describe('formatTime', () => {
    it('formats morning time correctly', () => {
      expect(formatTime('08:30')).toBe('8:30 AM');
      expect(formatTime('09:00')).toBe('9:00 AM');
      expect(formatTime('11:45')).toBe('11:45 AM');
    });

    it('formats afternoon time correctly', () => {
      expect(formatTime('13:30')).toBe('1:30 PM');
      expect(formatTime('14:00')).toBe('2:00 PM');
      expect(formatTime('17:45')).toBe('5:45 PM');
    });

    it('formats noon correctly', () => {
      expect(formatTime('12:00')).toBe('12:00 PM');
      expect(formatTime('12:30')).toBe('12:30 PM');
    });

    it('formats midnight correctly', () => {
      expect(formatTime('00:00')).toBe('12:00 AM');
      expect(formatTime('00:30')).toBe('12:30 AM');
    });

    it('preserves minutes', () => {
      expect(formatTime('09:05')).toBe('9:05 AM');
      expect(formatTime('15:15')).toBe('3:15 PM');
    });
  });

  describe('getTimeBlockPosition', () => {
    it('calculates position for block at start of day', () => {
      const result = getTimeBlockPosition('06:00', '08:00', '06:00', '22:00');
      expect(result.top).toBe(0);
      expect(result.height).toBeCloseTo(12.5, 1); // 2 hours / 16 hours * 100
    });

    it('calculates position for block in middle of day', () => {
      const result = getTimeBlockPosition('10:00', '12:00', '06:00', '22:00');
      // 4 hours from start / 16 hours total = 25%
      expect(result.top).toBeCloseTo(25, 1);
      // 2 hours duration / 16 hours total = 12.5%
      expect(result.height).toBeCloseTo(12.5, 1);
    });

    it('calculates position for block at end of day', () => {
      const result = getTimeBlockPosition('20:00', '22:00', '06:00', '22:00');
      expect(result.top).toBeCloseTo(87.5, 1);
      expect(result.height).toBeCloseTo(12.5, 1);
    });

    it('uses default day bounds when not provided', () => {
      const result = getTimeBlockPosition('08:00', '10:00');
      // Default is 06:00-22:00 (16 hours)
      // 2 hours from start = 12.5%
      expect(result.top).toBeCloseTo(12.5, 1);
      expect(result.height).toBeCloseTo(12.5, 1);
    });

    it('clamps negative top values to 0', () => {
      // Block starts before day start
      const result = getTimeBlockPosition('05:00', '07:00', '06:00', '22:00');
      expect(result.top).toBe(0);
    });

    it('clamps height to not exceed 100%', () => {
      // Block ends after day end
      const result = getTimeBlockPosition('20:00', '23:00', '06:00', '22:00');
      expect(result.top + result.height).toBeLessThanOrEqual(100);
    });

    it('handles custom day bounds', () => {
      // Custom day: 08:00-18:00 (10 hours)
      const result = getTimeBlockPosition('10:00', '12:00', '08:00', '18:00');
      // 2 hours from start / 10 hours = 20%
      expect(result.top).toBeCloseTo(20, 1);
      // 2 hours duration / 10 hours = 20%
      expect(result.height).toBeCloseTo(20, 1);
    });
  });
});
