import { useMemo } from 'react';
import { format } from 'date-fns';
import { useCalendar } from '@/hooks/use-calendar';
import { useDaysForWeek } from '@/hooks/use-days';
import { getWeekDays, formatDateForApi, isToday, getTimeBlockPosition } from '@/lib/date-utils';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import type { Day } from '@/types/calendar';

const HOURS = Array.from({ length: 19 }, (_, i) => i + 6); // 6 AM to 12 AM

export function WeekView() {
  const { selectedDate, setSelectedDate, setCurrentView } = useCalendar();
  const { data: days, isLoading } = useDaysForWeek(selectedDate);

  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate]);

  const daysMap = useMemo(() => {
    if (!days) return new Map<string, Day>();
    return new Map(days.map((day) => [formatDateForApi(new Date(day.date)), day]));
  }, [days]);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setCurrentView('day');
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

          {/* Time grid */}
          <div className="relative max-h-[60vh] flex-1 overflow-y-auto sm:max-h-[70vh]">
            <div className="grid min-h-[800px] grid-cols-8">
              {/* Time labels column */}
              <div className="sticky left-0 z-10 border-r bg-background">
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="flex h-10 items-center justify-end border-b pr-1 sm:h-12 sm:pr-2"
                  >
                    <span className="text-[10px] text-muted-foreground sm:text-xs">
                      {format(new Date().setHours(hour, 0), 'h a')}
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
                            'absolute inset-x-0.5 overflow-hidden rounded px-1 py-0.5 text-[10px] sm:inset-x-1 sm:rounded-md sm:px-2 sm:py-1 sm:text-xs',
                            block.isCompleted && 'opacity-60'
                          )}
                          style={{
                            top: `${top}%`,
                            height: `${Math.max(height, 4)}%`,
                            backgroundColor: block.color || '#A5D8FF',
                          }}
                        >
                          <div className="truncate font-medium">{block.name}</div>
                          {height > 10 && (
                            <div className="hidden text-[10px] opacity-75 sm:block">
                              {block.startTime} - {block.endTime}
                            </div>
                          )}
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
