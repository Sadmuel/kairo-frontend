import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { daysService } from '@/services/days';
import type { CreateDayDto, UpdateDayDto } from '@/types/calendar';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { statsKeys } from './use-stats';
import { dashboardKeys } from './use-dashboard';

// Query keys
export const daysKeys = {
  all: ['days'] as const,
  range: (start: string, end: string) => [...daysKeys.all, 'range', start, end] as const,
  detail: (id: string) => [...daysKeys.all, 'detail', id] as const,
  byDate: (date: string) => [...daysKeys.all, 'date', date] as const,
};

// Get days for month view
export function useDaysForMonth(date: Date) {
  const start = format(startOfWeek(startOfMonth(date)), 'yyyy-MM-dd');
  const end = format(endOfWeek(endOfMonth(date)), 'yyyy-MM-dd');

  return useQuery({
    queryKey: daysKeys.range(start, end),
    queryFn: () => daysService.getByDateRange(start, end),
  });
}

// Get days for week view
export function useDaysForWeek(date: Date) {
  const start = format(startOfWeek(date), 'yyyy-MM-dd');
  const end = format(endOfWeek(date), 'yyyy-MM-dd');

  return useQuery({
    queryKey: daysKeys.range(start, end),
    queryFn: () => daysService.getByDateRange(start, end),
  });
}

// Get single day by date
export function useDayByDate(date: string) {
  return useQuery({
    queryKey: daysKeys.byDate(date),
    queryFn: () => daysService.getByDate(date),
  });
}

// Get single day by ID
export function useDay(id: string) {
  return useQuery({
    queryKey: daysKeys.detail(id),
    queryFn: () => daysService.getById(id),
    enabled: !!id,
  });
}

// Create day mutation
export function useCreateDay() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDayDto) => daysService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: daysKeys.all });
      queryClient.invalidateQueries({ queryKey: statsKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}

// Update day mutation
export function useUpdateDay() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDayDto }) =>
      daysService.update(id, data),
    onSuccess: (updatedDay) => {
      queryClient.invalidateQueries({ queryKey: daysKeys.all });
      queryClient.invalidateQueries({ queryKey: statsKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      queryClient.setQueryData(daysKeys.detail(updatedDay.id), updatedDay);
    },
  });
}

// Delete day mutation
export function useDeleteDay() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => daysService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: daysKeys.all });
      queryClient.invalidateQueries({ queryKey: statsKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}

// Ensure day exists (get or create)
export function useEnsureDay() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (date: string) => daysService.getOrCreate(date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: daysKeys.all });
    },
  });
}
