import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EventForm } from './event-form';
import { useCreateEvent, useUpdateEvent } from '@/hooks/use-events';
import type { Event, CreateEventDto, UpdateEventDto } from '@/types/calendar';

interface EventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: Event;
  initialDate?: string;
}

export function EventModal({
  open,
  onOpenChange,
  event,
  initialDate,
}: EventModalProps) {
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const isEdit = !!event;

  const handleCreate = async (data: CreateEventDto) => {
    await createEvent.mutateAsync(data);
    onOpenChange(false);
  };

  const handleUpdate = async (data: UpdateEventDto) => {
    if (!event) return;
    await updateEvent.mutateAsync({
      id: event.id,
      data,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Event' : 'Create Event'}</DialogTitle>
        </DialogHeader>
        {isEdit && event ? (
          <EventForm
            mode="edit"
            event={event}
            onSubmit={handleUpdate}
            onCancel={() => onOpenChange(false)}
            isPending={updateEvent.isPending}
          />
        ) : (
          <EventForm
            mode="create"
            initialDate={initialDate}
            onSubmit={handleCreate}
            onCancel={() => onOpenChange(false)}
            isPending={createEvent.isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
