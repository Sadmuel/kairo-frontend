import { api } from './api';
import type { Day, CreateDayDto, UpdateDayDto } from '@/types/calendar';

export const daysService = {
  async getByDateRange(startDate: string, endDate: string): Promise<Day[]> {
    const response = await api.get<Day[]>('/days', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  async getById(id: string): Promise<Day> {
    const response = await api.get<Day>(`/days/${id}`);
    return response.data;
  },

  async getByDate(date: string): Promise<Day | null> {
    const response = await api.get<Day | null>(`/days/date/${date}`);
    return response.data;
  },

  async create(data: CreateDayDto): Promise<Day> {
    const response = await api.post<Day>('/days', data);
    return response.data;
  },

  async update(id: string, data: UpdateDayDto): Promise<Day> {
    const response = await api.patch<Day>(`/days/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/days/${id}`);
  },

  async getOrCreate(date: string): Promise<Day> {
    const existing = await this.getByDate(date);
    if (existing) {
      return existing;
    }
    return this.create({ date });
  },
};
