import { api } from './api';
import type {
  Todo,
  CreateTodoDto,
  UpdateTodoDto,
  MoveTodoDto,
  ReorderTodosDto,
  TodoFilterQuery,
  DuplicateTodoDto,
} from '@/types/calendar';

export const todosService = {
  async getAll(filters?: TodoFilterQuery): Promise<Todo[]> {
    const response = await api.get<Todo[]>('/todos', {
      params: filters,
    });
    return response.data;
  },

  async getById(id: string): Promise<Todo> {
    const response = await api.get<Todo>(`/todos/${id}`);
    return response.data;
  },

  async create(data: CreateTodoDto): Promise<Todo> {
    const response = await api.post<Todo>('/todos', data);
    return response.data;
  },

  async update(id: string, data: UpdateTodoDto): Promise<Todo> {
    const response = await api.patch<Todo>(`/todos/${id}`, data);
    return response.data;
  },

  async move(id: string, data: MoveTodoDto): Promise<Todo> {
    const response = await api.patch<Todo>(`/todos/${id}/move`, data);
    return response.data;
  },

  async reorder(
    context: { dayId?: string; timeBlockId?: string; inbox?: boolean },
    data: ReorderTodosDto
  ): Promise<Todo[]> {
    const response = await api.patch<Todo[]>('/todos/reorder', data, {
      params: context,
    });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/todos/${id}`);
  },

  async duplicate(id: string, data: DuplicateTodoDto): Promise<Todo> {
    const response = await api.post<Todo>(`/todos/${id}/duplicate`, data);
    return response.data;
  },
};
