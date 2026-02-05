import { api } from './api';
import type {
  TimeBlockTemplate,
  CreateTimeBlockTemplateDto,
  UpdateTimeBlockTemplateDto,
  DeactivateTemplateDto,
} from '@/types/calendar';

export const timeBlockTemplatesService = {
  async getAll(): Promise<TimeBlockTemplate[]> {
    const response = await api.get<TimeBlockTemplate[]>('/time-block-templates');
    return response.data;
  },

  async getById(id: string): Promise<TimeBlockTemplate> {
    const response = await api.get<TimeBlockTemplate>(`/time-block-templates/${id}`);
    return response.data;
  },

  async create(data: CreateTimeBlockTemplateDto): Promise<TimeBlockTemplate> {
    const response = await api.post<TimeBlockTemplate>('/time-block-templates', data);
    return response.data;
  },

  async update(id: string, data: UpdateTimeBlockTemplateDto): Promise<TimeBlockTemplate> {
    const response = await api.patch<TimeBlockTemplate>(`/time-block-templates/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/time-block-templates/${id}`);
  },

  async deactivate(id: string, data: DeactivateTemplateDto): Promise<TimeBlockTemplate> {
    const response = await api.patch<TimeBlockTemplate>(
      `/time-block-templates/${id}/deactivate`,
      data,
    );
    return response.data;
  },
};
