import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsService } from '@/services/events';
import type { CreateEventDto, UpdateEventDto } from '@/types/calendar';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { dashboardKeys } from './use-dashboard';

export const eventsKeys = {
  all: ['events'] as const,
  detail: (id: string) => [...eventsKeys.all, 'detail', id] as const,
  calendar: (start: string, end: string) =>
    [...eventsKeys.all, 'calendar', start, end] as const,
};

// Get all base events
export function useEvents() {
  return useQuery({
    queryKey: eventsKeys.all,
    queryFn: () => eventsService.getAll(),
  });
}

// Get events for month view (includes padding days from adjacent weeks)
export function useEventsForMonth(date: Date) {
  const start = format(startOfWeek(startOfMonth(date)), 'yyyy-MM-dd');
  const end = format(endOfWeek(endOfMonth(date)), 'yyyy-MM-dd');

  return useQuery({
    queryKey: eventsKeys.calendar(start, end),
    queryFn: () => eventsService.getCalendar({ startDate: start, endDate: end }),
  });
}

// Get events for week view
export function useEventsForWeek(date: Date) {
  const start = format(startOfWeek(date), 'yyyy-MM-dd');
  const end = format(endOfWeek(date), 'yyyy-MM-dd');

  return useQuery({
    queryKey: eventsKeys.calendar(start, end),
    queryFn: () => eventsService.getCalendar({ startDate: start, endDate: end }),
  });
}

// Get events for day view
export function useEventsForDay(date: Date) {
  const dateStr = format(date, 'yyyy-MM-dd');

  return useQuery({
    queryKey: eventsKeys.calendar(dateStr, dateStr),
    queryFn: () =>
      eventsService.getCalendar({ startDate: dateStr, endDate: dateStr }),
  });
}

// Get single event
export function useEvent(id: string) {
  return useQuery({
    queryKey: eventsKeys.detail(id),
    queryFn: () => eventsService.getById(id),
    enabled: !!id,
  });
}

// Helper to invalidate all events queries including calendar queries
function invalidateAllEventsQueries(queryClient: ReturnType<typeof useQueryClient>) {
  // Invalidate all queries that start with 'events'
  queryClient.invalidateQueries({
    predicate: (query) => query.queryKey[0] === 'events',
  });
}

// Create event
export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventDto) => eventsService.create(data),
    onSuccess: () => {
      invalidateAllEventsQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (error) => {
      console.error('Failed to create event:', error);
    },
  });
}

// Update event
export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEventDto }) =>
      eventsService.update(id, data),
    onSuccess: () => {
      invalidateAllEventsQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (error, variables) => {
      console.error('Failed to update event:', error, { id: variables.id });
    },
  });
}

// Delete event
export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventsService.delete(id),
    onSuccess: () => {
      invalidateAllEventsQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
    onError: (error, id) => {
      console.error('Failed to delete event:', error, { id });
    },
  });
}
