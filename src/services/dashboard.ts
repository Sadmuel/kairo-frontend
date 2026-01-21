import { api } from './api';
import type { DashboardResponse } from '@/types/dashboard';

function getLocalDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export const dashboardService = {
  async get(): Promise<DashboardResponse> {
    const date = getLocalDateString();
    const response = await api.get<DashboardResponse>('/dashboard', {
      params: { date },
    });
    return response.data;
  },
};
