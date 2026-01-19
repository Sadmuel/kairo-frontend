import { describe, it, expect } from 'vitest';
import { daysService } from '../days';
import { mockDay } from '@/test/mocks/handlers';

describe('daysService', () => {
  describe('getByDateRange', () => {
    it('fetches days within a date range', async () => {
      const result = await daysService.getByDateRange('2024-01-01', '2024-01-31');
      expect(result).toEqual([mockDay]);
    });
  });

  describe('getById', () => {
    it('fetches a single day by ID', async () => {
      const result = await daysService.getById('day-1');
      expect(result).toEqual(mockDay);
      expect(result.id).toBe('day-1');
    });
  });

  describe('getByDate', () => {
    it('fetches a day by date string', async () => {
      const result = await daysService.getByDate('2024-01-15');
      expect(result).toEqual(mockDay);
      expect(result?.date).toBe('2024-01-15');
    });
  });

  describe('create', () => {
    it('creates a new day', async () => {
      const result = await daysService.create({ date: '2024-01-20' });

      expect(result.id).toBe('new-day-id');
      expect(result.date).toBe('2024-01-20');
    });
  });

  describe('update', () => {
    it('updates a day', async () => {
      const result = await daysService.update('day-1', {
        isCompleted: true,
      });

      expect(result.id).toBe('day-1');
      expect(result.isCompleted).toBe(true);
    });
  });

  describe('delete', () => {
    it('deletes a day', async () => {
      await expect(daysService.delete('day-1')).resolves.toBeUndefined();
    });
  });
});
