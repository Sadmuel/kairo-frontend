import { useCalendar } from '@/hooks/use-calendar';
import { MonthView } from './month-view';
import { WeekView } from './week-view';
import { DayView } from './day-view';

export function CalendarGrid() {
  const { currentView } = useCalendar();

  switch (currentView) {
    case 'month':
      return <MonthView />;
    case 'week':
      return <WeekView />;
    case 'day':
      return <DayView />;
  }
}
