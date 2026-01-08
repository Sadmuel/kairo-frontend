import { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useEventsForDay } from '@/hooks/use-events';
import { EventCard } from './event-card';
import { EventModal } from './event-modal';
import { formatDateForApi } from '@/lib/date-utils';

interface EventsSectionProps {
  date: Date;
}

export function EventsSection({ date }: EventsSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: events, isLoading } = useEventsForDay(date);
  const dateString = formatDateForApi(date);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">Events</h3>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-14 w-full" />
        </div>
      </div>
    );
  }

  const hasEvents = events && events.length > 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          Events
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="mr-1 h-3 w-3" />
          Add Event
        </Button>
      </div>

      {hasEvents ? (
        <div className="space-y-2">
          {events.map((event) => (
            <EventCard key={`${event.id}-${event.occurrenceDate}`} event={event} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground py-2">
          No events for this day
        </p>
      )}

      <EventModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialDate={dateString}
      />
    </div>
  );
}
