import { useMemo } from 'react';
import { useCalendar } from '@/hooks/use-calendar';
import { useDaysForMonth } from '@/hooks/use-days';
import { useEventsForMonth } from '@/hooks/use-events';
import { getMonthViewDays, formatDateForApi } from '@/lib/date-utils';
import { DayCell } from './day-cell';
import { Skeleton } from '@/components/ui/skeleton';
import type { EventOccurrence } from '@/types/calendar';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAYS_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function MonthView() {
  const { selectedDate, setSelectedDate, setCurrentView } = useCalendar();
  const { data: days, isLoading: isDaysLoading } = useDaysForMonth(selectedDate);
  const { data: events, isLoading: isEventsLoading } = useEventsForMonth(selectedDate);

  const isLoading = isDaysLoading || isEventsLoading;

  const viewDays = useMemo(() => getMonthViewDays(selectedDate), [selectedDate]);

  const daysMap = useMemo(() => {
    if (!days) return new Map();
    // Normalize ISO date strings to YYYY-MM-DD format for lookup
    return new Map(days.map((day) => [day.date.split('T')[0], day]));
  }, [days]);

  const eventsMap = useMemo(() => {
    if (!events) return new Map<string, EventOccurrence[]>();
    // Group events by occurrence date (normalize to YYYY-MM-DD for consistent lookup)
    const map = new Map<string, EventOccurrence[]>();
    for (const event of events) {
      const dateKey = event.occurrenceDate.split('T')[0];
      const existing = map.get(dateKey) || [];
      existing.push(event);
      map.set(dateKey, existing);
    }
    return map;
  }, [events]);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setCurrentView('day');
  };

  if (isLoading) {
    return <MonthViewSkeleton />;
  }

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-7 border-l border-t">
        {WEEKDAYS.map((day, index) => (
          <div
            key={day}
            className="border-b border-r bg-muted/50 px-1 py-2 text-center text-xs font-medium sm:px-2 sm:py-3 sm:text-sm"
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{WEEKDAYS_SHORT[index]}</span>
          </div>
        ))}
        {viewDays.map((date) => {
          const dateKey = formatDateForApi(date);
          return (
            <DayCell
              key={date.toISOString()}
              date={date}
              currentMonth={selectedDate}
              day={daysMap.get(dateKey)}
              events={eventsMap.get(dateKey)}
              onClick={handleDayClick}
            />
          );
        })}
      </div>
    </div>
  );
}

function MonthViewSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-7 border-l border-t">
        {WEEKDAYS.map((day, index) => (
          <div
            key={day}
            className="border-b border-r bg-muted/50 px-1 py-2 text-center text-xs font-medium sm:px-2 sm:py-3 sm:text-sm"
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{WEEKDAYS_SHORT[index]}</span>
          </div>
        ))}
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="h-20 border-b border-r p-1 sm:h-28 sm:p-2">
            <Skeleton className="h-6 w-6 rounded-full sm:h-7 sm:w-7" />
          </div>
        ))}
      </div>
    </div>
  );
}
