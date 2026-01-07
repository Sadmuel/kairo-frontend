import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { todosService } from '@/services/todos';
import type {
  CreateTodoDto,
  UpdateTodoDto,
  MoveTodoDto,
  ReorderTodosDto,
  TodoFilterQuery,
} from '@/types/calendar';
import { daysKeys } from './use-days';
import { timeBlocksKeys } from './use-time-blocks';

export const todosKeys = {
  all: ['todos'] as const,
  list: (filters?: TodoFilterQuery) => [...todosKeys.all, 'list', filters] as const,
  byDay: (dayId: string) => [...todosKeys.all, 'day', dayId] as const,
  byTimeBlock: (timeBlockId: string) =>
    [...todosKeys.all, 'timeBlock', timeBlockId] as const,
  inbox: (filters?: { isCompleted?: boolean }) =>
    [...todosKeys.all, 'inbox', filters] as const,
  detail: (id: string) => [...todosKeys.all, 'detail', id] as const,
};

// Get todos with filters
export function useTodos(filters?: TodoFilterQuery) {
  return useQuery({
    queryKey: todosKeys.list(filters),
    queryFn: () => todosService.getAll(filters),
  });
}

// Get todos for a specific day
export function useTodosByDay(dayId: string) {
  return useQuery({
    queryKey: todosKeys.byDay(dayId),
    queryFn: () => todosService.getAll({ dayId }),
    enabled: !!dayId,
  });
}

// Get todos for a specific time block
export function useTodosByTimeBlock(timeBlockId: string) {
  return useQuery({
    queryKey: todosKeys.byTimeBlock(timeBlockId),
    queryFn: () => todosService.getAll({ timeBlockId }),
    enabled: !!timeBlockId,
  });
}

// Get inbox todos (unassigned)
export function useInboxTodos(filters?: { isCompleted?: boolean }) {
  return useQuery({
    queryKey: todosKeys.inbox(filters),
    queryFn: () => todosService.getAll({ inbox: true, ...filters }),
  });
}

// Get single todo
export function useTodo(id: string) {
  return useQuery({
    queryKey: todosKeys.detail(id),
    queryFn: () => todosService.getById(id),
    enabled: !!id,
  });
}

// Create todo
export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTodoDto) => todosService.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: todosKeys.all });
      // Invalidate days query to update nested todos in day/timeblock views
      if (variables.timeBlockId || variables.dayId) {
        queryClient.invalidateQueries({ queryKey: daysKeys.all });
        queryClient.invalidateQueries({ queryKey: timeBlocksKeys.all });
      }
    },
  });
}

// Update todo
export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTodoDto }) =>
      todosService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todosKeys.all });
      // Also invalidate days and time blocks to update nested todos
      queryClient.invalidateQueries({ queryKey: daysKeys.all });
      queryClient.invalidateQueries({ queryKey: timeBlocksKeys.all });
    },
  });
}

// Move todo between contexts
export function useMoveTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MoveTodoDto }) =>
      todosService.move(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todosKeys.all });
      queryClient.invalidateQueries({ queryKey: daysKeys.all });
      queryClient.invalidateQueries({ queryKey: timeBlocksKeys.all });
    },
  });
}

// Reorder todos
export function useReorderTodos() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      context,
      data,
    }: {
      context: { dayId?: string; timeBlockId?: string; inbox?: boolean };
      data: ReorderTodosDto;
    }) => todosService.reorder(context, data),
    onSuccess: (_, variables) => {
      // Invalidate specific context query
      if (variables.context.timeBlockId) {
        queryClient.invalidateQueries({
          queryKey: todosKeys.byTimeBlock(variables.context.timeBlockId),
        });
      } else if (variables.context.dayId) {
        queryClient.invalidateQueries({
          queryKey: todosKeys.byDay(variables.context.dayId),
        });
      } else if (variables.context.inbox) {
        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey[0] === 'todos' && query.queryKey[1] === 'inbox',
        });
      }
      // Also invalidate days to update nested todos
      queryClient.invalidateQueries({ queryKey: daysKeys.all });
    },
    onError: (error, variables) => {
      console.error('Failed to reorder todos:', error);
      // Refetch to restore correct order from server
      if (variables.context.timeBlockId) {
        queryClient.invalidateQueries({
          queryKey: todosKeys.byTimeBlock(variables.context.timeBlockId),
        });
      } else if (variables.context.dayId) {
        queryClient.invalidateQueries({
          queryKey: todosKeys.byDay(variables.context.dayId),
        });
      } else if (variables.context.inbox) {
        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey[0] === 'todos' && query.queryKey[1] === 'inbox',
        });
      }
      queryClient.invalidateQueries({ queryKey: daysKeys.all });
    },
  });
}

// Delete todo
export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => todosService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todosKeys.all });
      queryClient.invalidateQueries({ queryKey: daysKeys.all });
      queryClient.invalidateQueries({ queryKey: timeBlocksKeys.all });
    },
  });
}
