'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, GripVertical, Pencil, Trash2 } from 'lucide-react';
import { useSortable, CSS } from '@/lib/dnd-kit';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { formatTime } from '@/lib/date-utils';
import { useUpdateTimeBlock, useDeleteTimeBlock } from '@/hooks/use-time-blocks';
import { TimeBlockModal } from './time-block-modal';
import { NoteList } from '@/components/notes/note-list';
import type { TimeBlock } from '@/types/calendar';
import { cn } from '@/lib/utils';

interface TimeBlockCardProps {
  timeBlock: TimeBlock;
  dayId: string;
}

export function TimeBlockCard({ timeBlock, dayId }: TimeBlockCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [toggleError, setToggleError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const updateTimeBlock = useUpdateTimeBlock();
  const deleteTimeBlock = useDeleteTimeBlock();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: timeBlock.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleToggleComplete = async () => {
    setToggleError(null);
    try {
      await updateTimeBlock.mutateAsync({
        id: timeBlock.id,
        data: { isCompleted: !timeBlock.isCompleted },
      });
    } catch (error) {
      console.error('Failed to toggle time block completion:', error);
      setToggleError('Failed to update. Please try again.');
    }
  };

  const handleDelete = async () => {
    setDeleteError(null);
    try {
      await deleteTimeBlock.mutateAsync(timeBlock.id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Failed to delete time block:', error);
      setDeleteError('Failed to delete. Please try again.');
    }
  };

  const handleDeleteDialogChange = (open: boolean) => {
    setIsDeleteDialogOpen(open);
    if (!open) {
      setDeleteError(null);
    }
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        className={cn(
          'transition-shadow',
          isDragging && 'opacity-50 shadow-lg',
          timeBlock.isCompleted && 'opacity-60'
        )}
      >
        <div
          className="flex items-start gap-2 p-3 sm:gap-3 sm:p-4"
          style={{ borderLeftWidth: 4, borderLeftColor: timeBlock.color || '#A5D8FF' }}
        >
          {/* Drag handle - larger touch target on mobile */}
          <button
            {...attributes}
            {...listeners}
            className="mt-0.5 flex h-10 w-10 cursor-grab items-center justify-center touch-none text-muted-foreground hover:text-foreground sm:h-auto sm:w-auto"
          >
            <GripVertical className="h-5 w-5" />
          </button>

          {/* Checkbox - wrapped for better touch target */}
          <div className="mt-0.5 flex h-10 w-10 items-center justify-center sm:h-auto sm:w-auto">
            <Checkbox
              checked={timeBlock.isCompleted}
              onCheckedChange={handleToggleComplete}
              disabled={updateTimeBlock.isPending}
              className="h-5 w-5 sm:h-4 sm:w-4"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3
                  className={cn(
                    'font-medium truncate text-sm sm:text-base',
                    timeBlock.isCompleted && 'line-through text-muted-foreground'
                  )}
                >
                  {timeBlock.name}
                </h3>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  {formatTime(timeBlock.startTime)} - {formatTime(timeBlock.endTime)}
                </p>
                {toggleError && (
                  <p className="text-xs text-destructive mt-1">{toggleError}</p>
                )}
              </div>

              {/* Action buttons - min 44px touch targets on mobile */}
              <div className="flex items-center gap-0 shrink-0 sm:gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 sm:h-9 sm:w-9"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-destructive hover:text-destructive sm:h-9 sm:w-9"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 sm:h-9 sm:w-9"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Notes section (expanded) */}
            {isExpanded && (
              <div className="mt-3 pt-3 border-t">
                <NoteList timeBlockId={timeBlock.id} notes={timeBlock.notes} />
              </div>
            )}

            {/* Notes preview (collapsed) */}
            {!isExpanded && timeBlock.notes.length > 0 && (
              <p className="mt-1 text-sm text-muted-foreground truncate">
                {timeBlock.notes.length} note{timeBlock.notes.length > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      </Card>

      <TimeBlockModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        dayId={dayId}
        timeBlock={timeBlock}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={handleDeleteDialogChange}
        title="Delete Time Block"
        description={`Are you sure you want to delete "${timeBlock.name}"? This will also delete all notes in this time block.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={deleteTimeBlock.isPending}
        loadingLabel="Deleting..."
        error={deleteError}
      />
    </>
  );
}
