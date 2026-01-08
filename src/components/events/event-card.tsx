import { useState } from 'react';
import { Pencil, Trash2, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useDeleteEvent } from '@/hooks/use-events';
import { EventModal } from './event-modal';
import type { Event, EventOccurrence } from '@/types/calendar';

interface EventCardProps {
  event: EventOccurrence;
}

const RECURRENCE_LABELS: Record<string, string> = {
  DAILY: 'Daily',
  WEEKDAYS: 'Weekdays',
  WEEKENDS: 'Weekends',
  WEEKLY: 'Weekly',
  MONTHLY: 'Monthly',
  YEARLY: 'Yearly',
};

export function EventCard({ event }: EventCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const deleteEvent = useDeleteEvent();

  const handleDelete = async () => {
    setDeleteError(null);
    try {
      await deleteEvent.mutateAsync(event.id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Failed to delete event:', error);
      setDeleteError('Failed to delete. Please try again.');
    }
  };

  const handleDeleteDialogChange = (open: boolean) => {
    setIsDeleteDialogOpen(open);
    if (!open) {
      setDeleteError(null);
    }
  };

  // Convert EventOccurrence to Event for the modal
  // Use occurrenceDate so the edit form shows the correct date for this occurrence
  // Normalize to YYYY-MM-DD format for the date input
  const baseEvent: Event = {
    id: event.id,
    title: event.title,
    date: event.occurrenceDate.split('T')[0],
    color: event.color,
    isRecurring: event.isRecurring,
    recurrenceType: event.recurrenceType,
    userId: event.userId,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  };

  const deleteDescription = event.isRecurring
    ? `Are you sure you want to delete "${event.title}"? This will delete the event and all its future occurrences.`
    : `Are you sure you want to delete "${event.title}"?`;

  return (
    <>
      <Card>
        <div
          className="flex items-center gap-2 border-l-4 border-l-[--border-color] p-3 sm:gap-3 sm:p-4"
          style={
            { '--border-color': event.color || '#A5D8FF' } as React.CSSProperties
          }
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium truncate text-sm sm:text-base">
                {event.title}
              </h3>
              {event.isRecurring && (
                <span
                  className="flex items-center gap-1 text-xs text-muted-foreground shrink-0"
                  title={`Repeats ${RECURRENCE_LABELS[event.recurrenceType]}`}
                >
                  <Repeat className="h-3 w-3" />
                  <span className="hidden sm:inline">
                    {RECURRENCE_LABELS[event.recurrenceType]}
                  </span>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-0 shrink-0 sm:gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Edit event"
              className="h-10 w-10 sm:h-9 sm:w-9"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Delete event"
              className="h-10 w-10 text-destructive hover:text-destructive sm:h-9 sm:w-9"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <EventModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        event={baseEvent}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={handleDeleteDialogChange}
        title="Delete Event"
        description={deleteDescription}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={deleteEvent.isPending}
        loadingLabel="Deleting..."
        error={deleteError}
      />
    </>
  );
}
