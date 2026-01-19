import { describe, it, expect } from 'vitest';
import { notesService } from '../notes';
import { mockNote } from '@/test/mocks/handlers';

describe('notesService', () => {
  describe('getByTimeBlock', () => {
    it('fetches notes for a specific time block', async () => {
      const result = await notesService.getByTimeBlock('time-block-1');
      expect(result).toEqual([mockNote]);
    });
  });

  describe('create', () => {
    it('creates a new note', async () => {
      const result = await notesService.create({
        content: 'New note content',
        timeBlockId: 'time-block-1',
      });

      expect(result.id).toBe('new-note-id');
      expect(result.content).toBe('New note content');
    });

    it('creates a note with order', async () => {
      const result = await notesService.create({
        content: 'Ordered note',
        timeBlockId: 'time-block-1',
        order: 5,
      });

      expect(result.content).toBe('Ordered note');
    });
  });

  describe('update', () => {
    it('updates a note content', async () => {
      const result = await notesService.update('note-1', {
        content: 'Updated content',
      });

      expect(result.id).toBe('note-1');
      expect(result.content).toBe('Updated content');
    });
  });

  describe('delete', () => {
    it('deletes a note', async () => {
      await expect(notesService.delete('note-1')).resolves.toBeUndefined();
    });
  });

  describe('reorder', () => {
    it('reorders notes within a time block', async () => {
      const result = await notesService.reorder('time-block-1', {
        orderedIds: ['note-2', 'note-1'],
      });

      expect(result).toEqual([mockNote]);
    });
  });
});
