import { api } from './api';
import type { OverallStats, DayStats, WeekStats } from '@/types/stats';

export const statsService = {
  async getOverall(): Promise<OverallStats> {
    const response = await api.get<OverallStats>('/users/me/stats');
    return response.data;
  },

  async getDay(date: string): Promise<DayStats> {
    const response = await api.get<DayStats>(`/users/me/stats/day/${date}`);
    return response.data;
  },

  async getWeek(date: string): Promise<WeekStats> {
    const response = await api.get<WeekStats>(`/users/me/stats/week/${date}`);
    return response.data;
  },
};
