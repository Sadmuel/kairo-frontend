import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { useCalendar } from '@/hooks/use-calendar';
import { useDaysForWeek } from '@/hooks/use-days';
import { useEventsForWeek } from '@/hooks/use-events';
import { getWeekDays, formatDateForApi, isToday, getTimeBlockPosition } from '@/lib/date-utils';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { EventBadge } from '@/components/events';
import { EventModal } from '@/components/events';
import type { Day, EventOccurrence } from '@/types/calendar';

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 6 AM to 11 PM

export function WeekView() {
  const { selectedDate, navigateToDate } = useCalendar();
  const { data: days, isLoading: isDaysLoading } = useDaysForWeek(selectedDate);
  const { data: events, isLoading: isEventsLoading } = useEventsForWeek(selectedDate);
  const [selectedEvent, setSelectedEvent] = useState<EventOccurrence | null>(null);

  const isLoading = isDaysLoading || isEventsLoading;

  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate]);

  const daysMap = useMemo(() => {
    if (!days) return new Map<string, Day>();
    // Extract date string directly to avoid timezone conversion issues
    return new Map(days.map((day) => [day.date.split('T')[0], day]));
  }, [days]);

  const eventsMap = useMemo(() => {
    if (!events) return new Map<string, EventOccurrence[]>();
    const map = new Map<string, EventOccurrence[]>();
    for (const event of events) {
      // Normalize occurrenceDate to YYYY-MM-DD format for consistent lookup
      const dateKey = event.occurrenceDate.split('T')[0];
      const existing = map.get(dateKey) || [];
      existing.push(event);
      map.set(dateKey, existing);
    }
    return map;
  }, [events]);

  const formattedHours = useMemo(
    () => HOURS.map((h) => format(new Date().setHours(h, 0), 'h a')),
    []
  );

  const handleDayClick = (date: Date) => {
    navigateToDate(date, 'day');
  };

  if (isLoading) {
    return <WeekViewSkeleton />;
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border">
      {/* Scrollable container for mobile */}
      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          {/* Header with day names and dates */}
          <div className="grid grid-cols-8 border-b bg-muted/50">
            <div className="border-r px-1 py-2 sm:px-2 sm:py-3" /> {/* Empty corner cell */}
            {weekDays.map((date) => (
              <button
                key={date.toISOString()}
                onClick={() => handleDayClick(date)}
                aria-label={`View events for ${format(date, 'EEEE, MMMM d')}`}
                className={cn(
                  'border-r px-1 py-2 text-center transition-colors hover:bg-muted/80 sm:px-2 sm:py-3',
                  isToday(date) && 'bg-primary/10'
                )}
              >
                <div className="text-[10px] text-muted-foreground sm:text-xs">
                  {format(date, 'EEE')}
                </div>
                <div
                  className={cn(
                    'mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold sm:mt-1 sm:h-8 sm:w-8 sm:text-lg',
                    isToday(date) && 'bg-primary text-primary-foreground'
                  )}
                >
                  {format(date, 'd')}
                </div>
              </button>
            ))}
          </div>

          {/* Events row */}
          <div className="grid grid-cols-8 border-b">
            <div className="flex items-center justify-end border-r px-1 py-1 sm:px-2 sm:py-2">
              <span className="text-[10px] text-muted-foreground sm:text-xs">
                Events
              </span>
            </div>
            {weekDays.map((date) => {
              const dateKey = formatDateForApi(date);
              const dayEvents = eventsMap.get(dateKey) || [];
              return (
                <div
                  key={`events-${date.toISOString()}`}
                  className={cn(
                    'flex min-h-[32px] flex-col gap-0.5 border-r p-0.5 sm:min-h-[40px] sm:gap-1 sm:p-1',
                    isToday(date) && 'bg-primary/5'
                  )}
                >
                  {dayEvents.slice(0, 2).map((event) => (
                    <EventBadge
                      key={`${event.id}-${event.occurrenceDate}`}
                      event={event}
                      onClick={() => setSelectedEvent(event)}
                    />
                  ))}
                  {dayEvents.length > 2 && (
                    <span className="text-[10px] text-muted-foreground">
                      +{dayEvents.length - 2} more
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Time grid */}
          <div className="relative max-h-[60vh] flex-1 overflow-y-auto sm:max-h-[70vh]">
            <div className="grid min-h-[800px] grid-cols-8">
              {/* Time labels column */}
              <div className="sticky left-0 z-10 border-r bg-background">
                {formattedHours.map((label, i) => (
                  <div
                    key={HOURS[i]}
                    className="flex h-10 items-center justify-end border-b pr-1 sm:h-12 sm:pr-2"
                  >
                    <span className="text-[10px] text-muted-foreground sm:text-xs">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {weekDays.map((date) => {
                const day = daysMap.get(formatDateForApi(date));
                return (
                  <div
                    key={date.toISOString()}
                    className="relative border-r"
                  >
                    {/* Hour lines */}
                    {HOURS.map((hour) => (
                      <div key={hour} className="h-10 border-b sm:h-12" />
                    ))}

                    {/* Time blocks */}
                    {day?.timeBlocks.map((block) => {
                      const { top, height } = getTimeBlockPosition(
                        block.startTime,
                        block.endTime,
                        '06:00',
                        '24:00'
                      );
                      return (
                        <div
                          key={block.id}
                          className={cn(
                            'absolute inset-x-0.5 overflow-hidden rounded px-1 py-0.5 text-[10px] bg-[--block-bg] sm:inset-x-1 sm:rounded-md sm:px-2 sm:py-1 sm:text-xs',
                            block.isCompleted && 'opacity-60'
                          )}
                          style={{
                            '--block-bg': block.color || '#A5D8FF',
                            top: `${top}%`,
                            height: `${Math.max(height, 4)}%`,
                          } as React.CSSProperties}
                        >
                          <div className="truncate font-medium text-gray-900">{block.name}</div>
                          <div className="text-[8px] text-gray-700 sm:text-[10px]">
                            {block.startTime} - {block.endTime}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile hint */}
      <div className="border-t bg-muted/30 px-3 py-2 text-center text-xs text-muted-foreground sm:hidden">
        Swipe left/right to see all days
      </div>

      {/* Event edit modal */}
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
    </div>
  );
}

function WeekViewSkeleton() {
  const weekDays = Array.from({ length: 7 });

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border">
      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          <div className="grid grid-cols-8 border-b bg-muted/50">
            <div className="border-r px-1 py-2 sm:px-2 sm:py-3" />
            {weekDays.map((_, i) => (
              <div key={i} className="border-r px-1 py-2 text-center sm:px-2 sm:py-3">
                <Skeleton className="mx-auto h-3 w-6 sm:h-4 sm:w-8" />
                <Skeleton className="mx-auto mt-0.5 h-7 w-7 rounded-full sm:mt-1 sm:h-8 sm:w-8" />
              </div>
            ))}
          </div>
          <div className="h-[300px] sm:h-[400px]">
            <Skeleton className="h-full w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
