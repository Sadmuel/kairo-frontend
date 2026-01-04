import { api } from './api';
import type {
  TimeBlock,
  CreateTimeBlockDto,
  UpdateTimeBlockDto,
  ReorderTimeBlocksDto,
} from '@/types/calendar';

export const timeBlocksService = {
  async getByDay(dayId: string): Promise<TimeBlock[]> {
    const response = await api.get<TimeBlock[]>('/time-blocks', {
      params: { dayId },
    });
    return response.data;
  },

  async getById(id: string): Promise<TimeBlock> {
    const response = await api.get<TimeBlock>(`/time-blocks/${id}`);
    return response.data;
  },

  async create(data: CreateTimeBlockDto): Promise<TimeBlock> {
    const response = await api.post<TimeBlock>('/time-blocks', data);
    return response.data;
  },

  async update(id: string, data: UpdateTimeBlockDto): Promise<TimeBlock> {
    const response = await api.patch<TimeBlock>(`/time-blocks/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/time-blocks/${id}`);
  },

  async reorder(dayId: string, data: ReorderTimeBlocksDto): Promise<TimeBlock[]> {
    const response = await api.patch<TimeBlock[]>('/time-blocks/reorder', data, {
      params: { dayId },
    });
    return response.data;
  },
};
