import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesService } from '@/services/notes';
import type { CreateNoteDto, UpdateNoteDto, ReorderNotesDto } from '@/types/calendar';
import { timeBlocksKeys } from './use-time-blocks';
import { daysKeys } from './use-days';

export const notesKeys = {
  all: ['notes'] as const,
  byTimeBlock: (timeBlockId: string) =>
    [...notesKeys.all, 'timeBlock', timeBlockId] as const,
  detail: (id: string) => [...notesKeys.all, 'detail', id] as const,
};

// Get notes for a time block
export function useNotes(timeBlockId: string) {
  return useQuery({
    queryKey: notesKeys.byTimeBlock(timeBlockId),
    queryFn: () => notesService.getByTimeBlock(timeBlockId),
    enabled: !!timeBlockId,
  });
}

// Create note
export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNoteDto) => notesService.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: notesKeys.byTimeBlock(variables.timeBlockId),
      });
      queryClient.invalidateQueries({ queryKey: timeBlocksKeys.all });
      // Also invalidate days to update nested notes in timeBlocks
      queryClient.invalidateQueries({ queryKey: daysKeys.all });
    },
  });
}

// Update note
export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNoteDto }) =>
      notesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesKeys.all });
      // Also invalidate days to update nested notes in timeBlocks
      queryClient.invalidateQueries({ queryKey: daysKeys.all });
    },
  });
}

// Delete note
export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesKeys.all });
      queryClient.invalidateQueries({ queryKey: timeBlocksKeys.all });
      // Also invalidate days to update nested notes in timeBlocks
      queryClient.invalidateQueries({ queryKey: daysKeys.all });
    },
  });
}

// Reorder notes
export function useReorderNotes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      timeBlockId,
      data,
    }: {
      timeBlockId: string;
      data: ReorderNotesDto;
    }) => notesService.reorder(timeBlockId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: notesKeys.byTimeBlock(variables.timeBlockId),
      });
      // Also invalidate days to update nested notes in timeBlocks
      queryClient.invalidateQueries({ queryKey: daysKeys.all });
    },
  });
}
