import { useState } from 'react';
import { cn } from '@/lib/utils';
import { isToday, isSameMonth } from '@/lib/date-utils';
import type { Day, EventOccurrence } from '@/types/calendar';
import { DEFAULT_BLOCK_COLOR } from '@/types/calendar';
import { EventBadge } from '@/components/events';
import { EventModal } from '@/components/events';

interface DayCellProps {
  date: Date;
  currentMonth: Date;
  day?: Day;
  events?: EventOccurrence[];
  onClick: (date: Date) => void;
}

export function DayCell({
  date,
  currentMonth,
  day,
  events = [],
  onClick,
}: DayCellProps) {
  const [selectedEvent, setSelectedEvent] = useState<EventOccurrence | null>(
    null
  );
  const isCurrentMonth = isSameMonth(date, currentMonth);
  const isTodayDate = isToday(date);
  const hasTimeBlocks = (day?.timeBlocks?.length ?? 0) > 0;
  const hasEvents = events.length > 0;
  const isCompleted = day?.isCompleted;

  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleEventClick = (event: EventOccurrence) => {
    setSelectedEvent(event);
  };

  // Show max 2 events on mobile, 3 on desktop
  const visibleEvents = events.slice(0, 2);
  const hiddenEventsCount = events.length - 2;

  return (
    <>
      <button
        onClick={() => onClick(date)}
        aria-label={`Open events for ${formattedDate}`}
        className={cn(
          'relative flex h-20 flex-col items-start p-1 text-left transition-colors hover:bg-muted/50 sm:h-28 sm:p-2',
          'border-b border-r',
          !isCurrentMonth && 'bg-muted/30 text-muted-foreground',
          isTodayDate && 'bg-primary/5'
        )}
      >
        <span
          className={cn(
            'flex h-6 w-6 items-center justify-center rounded-full text-xs sm:h-7 sm:w-7 sm:text-sm',
            isTodayDate && 'bg-primary text-primary-foreground font-semibold'
          )}
        >
          {date.getDate()}
        </span>

        {hasEvents && (
          <div className="mt-0.5 flex w-full flex-col gap-0.5 overflow-hidden sm:mt-1">
            {visibleEvents.map((event) => (
              <EventBadge
                key={`${event.id}-${event.occurrenceDate}`}
                event={event}
                onClick={() => handleEventClick(event)}
              />
            ))}
            {hiddenEventsCount > 0 && (
              <span className="text-[10px] text-muted-foreground">
                +{hiddenEventsCount} more
              </span>
            )}
          </div>
        )}

        {hasTimeBlocks && day && (
          <div className="mt-0.5 flex flex-wrap gap-0.5 sm:mt-1 sm:gap-1">
            {day.timeBlocks.slice(0, 3).map((block) => (
              <Dot key={block.id} color={block.color} />
            ))}
            {day.timeBlocks.length > 3 && (
              <span className="hidden text-[10px] text-muted-foreground sm:inline">
                +{day.timeBlocks.length - 3}
              </span>
            )}
          </div>
        )}

        {isCompleted && (
          <div className="absolute bottom-0.5 right-0.5 text-green-500 sm:bottom-1 sm:right-1">
            <svg
              className="h-3 w-3 sm:h-4 sm:w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
      </button>

      {selectedEvent && (
        <EventModal
          open={!!selectedEvent}
          onOpenChange={(open) => !open && setSelectedEvent(null)}
          event={{
            id: selectedEvent.id,
            title: selectedEvent.title,
            date: selectedEvent.occurrenceDate.split('T')[0],
            color: selectedEvent.color,
            isRecurring: selectedEvent.isRecurring,
            recurrenceType: selectedEvent.recurrenceType,
            userId: selectedEvent.userId,
            createdAt: selectedEvent.createdAt,
            updatedAt: selectedEvent.updatedAt,
          }}
        />
      )}
    </>
  );
}

interface DotProps {
  color: string | null;
}

function Dot({ color }: DotProps) {
  return (
    <div
      className="h-1 w-1 rounded-full bg-[--dot-color] sm:h-1.5 sm:w-1.5"
      style={{ '--dot-color': color || DEFAULT_BLOCK_COLOR } as React.CSSProperties}
    />
  );
}
