import { describe, it, expect } from 'vitest';
import { todosService } from '../todos';
import { mockTodo } from '@/test/mocks/handlers';

describe('todosService', () => {
  describe('getAll', () => {
    it('fetches all todos', async () => {
      const result = await todosService.getAll();
      expect(result).toEqual([mockTodo]);
    });

    it('fetches todos with filters', async () => {
      const result = await todosService.getAll({ dayId: 'day-1' });
      expect(result).toEqual([mockTodo]);
    });

    it('fetches inbox todos', async () => {
      const result = await todosService.getAll({ inbox: true });
      expect(result).toEqual([mockTodo]);
    });
  });

  describe('getById', () => {
    it('fetches a single todo by ID', async () => {
      const result = await todosService.getById('todo-1');
      expect(result).toEqual(mockTodo);
      expect(result.id).toBe('todo-1');
    });
  });

  describe('create', () => {
    it('creates a new todo', async () => {
      const newTodo = {
        title: 'New Todo',
        dayId: 'day-1',
      };

      const result = await todosService.create(newTodo);

      expect(result.id).toBe('new-todo-id');
      expect(result.title).toBe('New Todo');
    });

    it('creates a todo with deadline', async () => {
      const newTodo = {
        title: 'Todo with deadline',
        deadline: '2024-01-20',
      };

      const result = await todosService.create(newTodo);
      expect(result.title).toBe('Todo with deadline');
    });
  });

  describe('update', () => {
    it('updates a todo', async () => {
      const result = await todosService.update('todo-1', {
        title: 'Updated Title',
      });

      expect(result.id).toBe('todo-1');
      expect(result.title).toBe('Updated Title');
    });

    it('marks a todo as completed', async () => {
      const result = await todosService.update('todo-1', {
        isCompleted: true,
      });

      expect(result.isCompleted).toBe(true);
    });
  });

  describe('move', () => {
    it('moves a todo to a different day', async () => {
      const result = await todosService.move('todo-1', {
        targetDayId: 'day-2',
      });

      expect(result.id).toBe('todo-1');
    });

    it('moves a todo to a time block', async () => {
      const result = await todosService.move('todo-1', {
        targetTimeBlockId: 'time-block-1',
      });

      expect(result.id).toBe('todo-1');
    });
  });

  describe('reorder', () => {
    it('reorders todos within a day', async () => {
      const result = await todosService.reorder(
        { dayId: 'day-1' },
        { orderedIds: ['todo-2', 'todo-1'] }
      );

      expect(result).toEqual([mockTodo]);
    });

    it('reorders todos within a time block', async () => {
      const result = await todosService.reorder(
        { timeBlockId: 'time-block-1' },
        { orderedIds: ['todo-2', 'todo-1'] }
      );

      expect(result).toEqual([mockTodo]);
    });

    it('reorders inbox todos', async () => {
      const result = await todosService.reorder(
        { inbox: true },
        { orderedIds: ['todo-2', 'todo-1'] }
      );

      expect(result).toEqual([mockTodo]);
    });
  });

  describe('delete', () => {
    it('deletes a todo', async () => {
      await expect(todosService.delete('todo-1')).resolves.toBeUndefined();
    });
  });
});
