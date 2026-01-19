import { describe, it, expect } from 'vitest';
import { timeBlocksService } from '../time-blocks';
import { mockTimeBlock } from '@/test/mocks/handlers';

describe('timeBlocksService', () => {
  describe('getByDay', () => {
    it('fetches time blocks for a specific day', async () => {
      const result = await timeBlocksService.getByDay('day-1');
      expect(result).toEqual([mockTimeBlock]);
    });
  });

  describe('getById', () => {
    it('fetches a single time block by ID', async () => {
      const result = await timeBlocksService.getById('time-block-1');
      expect(result).toEqual(mockTimeBlock);
      expect(result.id).toBe('time-block-1');
    });
  });

  describe('create', () => {
    it('creates a new time block', async () => {
      const result = await timeBlocksService.create({
        name: 'New Block',
        startTime: '10:00',
        endTime: '12:00',
        dayId: 'day-1',
      });

      expect(result.id).toBe('new-time-block-id');
      expect(result.name).toBe('New Block');
    });

    it('creates a time block with color', async () => {
      const result = await timeBlocksService.create({
        name: 'Colored Block',
        startTime: '14:00',
        endTime: '16:00',
        dayId: 'day-1',
        color: '#FCC2D7',
      });

      expect(result.name).toBe('Colored Block');
    });
  });

  describe('update', () => {
    it('updates a time block name', async () => {
      const result = await timeBlocksService.update('time-block-1', {
        name: 'Updated Name',
      });

      expect(result.id).toBe('time-block-1');
      expect(result.name).toBe('Updated Name');
    });

    it('marks a time block as completed', async () => {
      const result = await timeBlocksService.update('time-block-1', {
        isCompleted: true,
      });

      expect(result.isCompleted).toBe(true);
    });

    it('updates time block times', async () => {
      const result = await timeBlocksService.update('time-block-1', {
        startTime: '09:00',
        endTime: '11:00',
      });

      expect(result.startTime).toBe('09:00');
      expect(result.endTime).toBe('11:00');
    });
  });

  describe('delete', () => {
    it('deletes a time block', async () => {
      await expect(
        timeBlocksService.delete('time-block-1')
      ).resolves.toBeUndefined();
    });
  });

  describe('reorder', () => {
    it('reorders time blocks within a day', async () => {
      const result = await timeBlocksService.reorder('day-1', {
        orderedIds: ['time-block-2', 'time-block-1'],
      });

      expect(result).toEqual([mockTimeBlock]);
    });
  });
});
