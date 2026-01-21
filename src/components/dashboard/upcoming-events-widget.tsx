import { Link } from 'react-router-dom';
import { format, startOfToday, addDays } from 'date-fns';
import { CalendarDays, ChevronRight, Repeat } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { DashboardEvent } from '@/types/dashboard';

interface UpcomingEventsWidgetProps {
  data?: DashboardEvent[];
  isLoading?: boolean;
}

// Parse date string without timezone conversion
function parseDateLocal(dateStr: string): Date {
  const datePart = dateStr.split('T')[0];
  const [year, month, day] = datePart.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatEventDate(dateStr: string): string {
  const date = parseDateLocal(dateStr);
  const today = startOfToday();
  const tomorrow = addDays(today, 1);

  if (date.getTime() === today.getTime()) return 'Today';
  if (date.getTime() === tomorrow.getTime()) return 'Tomorrow';
  return format(date, 'EEE, MMM d');
}

function EventItem({ event }: { event: DashboardEvent }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-medium"
        style={{
          backgroundColor: event.color || '#A5D8FF',
          color: '#1a1a1a',
        }}
      >
        {parseDateLocal(event.occurrenceDate).getDate()}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-medium">{event.title}</span>
          {event.isRecurring && (
            <Repeat className="h-3 w-3 shrink-0 text-muted-foreground" />
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {formatEventDate(event.occurrenceDate)}
        </p>
      </div>
    </div>
  );
}

export function UpcomingEventsWidget({ data, isLoading }: UpcomingEventsWidgetProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="p-4 pb-2">
          <Skeleton className="h-5 w-36" />
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const events = data ?? [];
  const hasEvents = events.length > 0;

  return (
    <Card>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Upcoming Events</CardTitle>
          <Link
            to="/calendar"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            View calendar
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {hasEvents ? (
          <div className="space-y-2">
            {events.slice(0, 5).map((event, index) => (
              <EventItem
                key={`${event.id}-${event.occurrenceDate}-${index}`}
                event={event}
              />
            ))}
            {events.length > 5 && (
              <p className="text-center text-xs text-muted-foreground">
                +{events.length - 5} more events
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <CalendarDays className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No upcoming events</p>
            <p className="text-xs text-muted-foreground">
              Events in the next 7 days will appear here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
