import { api } from './api';
import type {
  Event,
  EventOccurrence,
  CreateEventDto,
  UpdateEventDto,
  EventCalendarQuery,
} from '@/types/calendar';

export const eventsService = {
  async getAll(): Promise<Event[]> {
    const response = await api.get<Event[]>('/events');
    return response.data;
  },

  async getCalendar(params: EventCalendarQuery): Promise<EventOccurrence[]> {
    const response = await api.get<EventOccurrence[]>('/events/calendar', {
      params,
    });
    return response.data;
  },

  async getById(id: string): Promise<Event> {
    const response = await api.get<Event>(`/events/${id}`);
    return response.data;
  },

  async create(data: CreateEventDto): Promise<Event> {
    const response = await api.post<Event>('/events', data);
    return response.data;
  },

  async update(id: string, data: UpdateEventDto): Promise<Event> {
    const response = await api.patch<Event>(`/events/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/events/${id}`);
  },
};
