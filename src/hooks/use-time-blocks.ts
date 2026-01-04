import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { timeBlocksService } from '@/services/time-blocks';
import type {
  CreateTimeBlockDto,
  UpdateTimeBlockDto,
  ReorderTimeBlocksDto,
} from '@/types/calendar';
import { daysKeys } from './use-days';

export const timeBlocksKeys = {
  all: ['time-blocks'] as const,
  byDay: (dayId: string) => [...timeBlocksKeys.all, 'day', dayId] as const,
  detail: (id: string) => [...timeBlocksKeys.all, 'detail', id] as const,
};

// Get time blocks for a day
export function useTimeBlocks(dayId: string) {
  return useQuery({
    queryKey: timeBlocksKeys.byDay(dayId),
    queryFn: () => timeBlocksService.getByDay(dayId),
    enabled: !!dayId,
  });
}

// Create time block
export function useCreateTimeBlock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTimeBlockDto) => timeBlocksService.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: timeBlocksKeys.byDay(variables.dayId),
      });
      queryClient.invalidateQueries({ queryKey: daysKeys.all });
    },
  });
}

// Update time block
export function useUpdateTimeBlock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTimeBlockDto }) =>
      timeBlocksService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timeBlocksKeys.all });
      queryClient.invalidateQueries({ queryKey: daysKeys.all });
    },
  });
}

// Delete time block
export function useDeleteTimeBlock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => timeBlocksService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timeBlocksKeys.all });
      queryClient.invalidateQueries({ queryKey: daysKeys.all });
    },
  });
}

// Reorder time blocks
export function useReorderTimeBlocks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dayId, data }: { dayId: string; data: ReorderTimeBlocksDto }) =>
      timeBlocksService.reorder(dayId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: timeBlocksKeys.byDay(variables.dayId),
      });
      // Also invalidate days to update nested timeBlocks
      queryClient.invalidateQueries({ queryKey: daysKeys.all });
    },
  });
}
