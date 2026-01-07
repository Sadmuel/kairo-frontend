import { api } from './api';
import type {
  Note,
  CreateNoteDto,
  UpdateNoteDto,
  ReorderNotesDto,
} from '@/types/calendar';

export const notesService = {
  async getByTimeBlock(timeBlockId: string): Promise<Note[]> {
    const response = await api.get<Note[]>('/notes', {
      params: { timeBlockId },
    });
    return response.data;
  },

  async getById(id: string): Promise<Note> {
    const response = await api.get<Note>(`/notes/${id}`);
    return response.data;
  },

  async create(data: CreateNoteDto): Promise<Note> {
    const response = await api.post<Note>('/notes', data);
    return response.data;
  },

  async update(id: string, data: UpdateNoteDto): Promise<Note> {
    const response = await api.patch<Note>(`/notes/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/notes/${id}`);
  },

  async reorder(timeBlockId: string, data: ReorderNotesDto): Promise<Note[]> {
    const response = await api.patch<Note[]>('/notes/reorder', data, {
      params: { timeBlockId },
    });
    return response.data;
  },
};
