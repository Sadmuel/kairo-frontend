import { describe, it, expect } from 'vitest';
import { eventsService } from '../events';
import { mockEvent } from '@/test/mocks/handlers';

describe('eventsService', () => {
  describe('getAll', () => {
    it('fetches all events', async () => {
      const result = await eventsService.getAll();
      expect(result).toEqual([mockEvent]);
    });
  });

  describe('getCalendar', () => {
    it('fetches events for a date range', async () => {
      const result = await eventsService.getCalendar({
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      });

      expect(result).toEqual([mockEvent]);
    });
  });

  describe('getById', () => {
    it('fetches a single event by ID', async () => {
      const result = await eventsService.getById('event-1');
      expect(result).toEqual(mockEvent);
      expect(result.id).toBe('event-1');
    });
  });

  describe('create', () => {
    it('creates a non-recurring event', async () => {
      const result = await eventsService.create({
        title: 'New Event',
        date: '2024-01-20',
      });

      expect(result.id).toBe('new-event-id');
      expect(result.title).toBe('New Event');
    });

    it('creates a recurring event', async () => {
      const result = await eventsService.create({
        title: 'Weekly Meeting',
        date: '2024-01-15',
        isRecurring: true,
        recurrenceType: 'WEEKLY',
      });

      expect(result.title).toBe('Weekly Meeting');
    });

    it('creates an event with color', async () => {
      const result = await eventsService.create({
        title: 'Birthday',
        date: '2024-03-15',
        color: '#FCC2D7',
      });

      expect(result.title).toBe('Birthday');
    });
  });

  describe('update', () => {
    it('updates an event title', async () => {
      const result = await eventsService.update('event-1', {
        title: 'Updated Event',
      });

      expect(result.id).toBe('event-1');
      expect(result.title).toBe('Updated Event');
    });

    it('updates event recurrence', async () => {
      const result = await eventsService.update('event-1', {
        isRecurring: true,
        recurrenceType: 'MONTHLY',
      });

      expect(result.isRecurring).toBe(true);
      expect(result.recurrenceType).toBe('MONTHLY');
    });

    it('updates event date', async () => {
      const result = await eventsService.update('event-1', {
        date: '2024-02-01',
      });

      expect(result.date).toBe('2024-02-01');
    });
  });

  describe('delete', () => {
    it('deletes an event', async () => {
      await expect(eventsService.delete('event-1')).resolves.toBeUndefined();
    });
  });
});
