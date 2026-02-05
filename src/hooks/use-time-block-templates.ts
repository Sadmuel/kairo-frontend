import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { timeBlockTemplatesService } from '@/services/time-block-templates';
import type {
  CreateTimeBlockTemplateDto,
  UpdateTimeBlockTemplateDto,
  DeactivateTemplateDto,
} from '@/types/calendar';
import { daysKeys } from './use-days';
import { statsKeys } from './use-stats';
import { dashboardKeys } from './use-dashboard';

export const templateKeys = {
  all: ['time-block-templates'] as const,
  detail: (id: string) => [...templateKeys.all, 'detail', id] as const,
};

export function useTemplates() {
  return useQuery({
    queryKey: templateKeys.all,
    queryFn: () => timeBlockTemplatesService.getAll(),
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTimeBlockTemplateDto) =>
      timeBlockTemplatesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.all });
      queryClient.invalidateQueries({ queryKey: daysKeys.all });
      queryClient.invalidateQueries({ queryKey: statsKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}

export function useUpdateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTimeBlockTemplateDto }) =>
      timeBlockTemplatesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.all });
      queryClient.invalidateQueries({ queryKey: daysKeys.all });
      queryClient.invalidateQueries({ queryKey: statsKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => timeBlockTemplatesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.all });
      queryClient.invalidateQueries({ queryKey: daysKeys.all });
      queryClient.invalidateQueries({ queryKey: statsKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}

export function useDeactivateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DeactivateTemplateDto }) =>
      timeBlockTemplatesService.deactivate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.all });
      queryClient.invalidateQueries({ queryKey: daysKeys.all });
      queryClient.invalidateQueries({ queryKey: statsKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}
