import {
  createContext,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  startOfToday,
  parseISO,
  format,
} from 'date-fns';
import type { CalendarView } from '@/types/calendar';

interface CalendarContextType {
  selectedDate: Date;
  currentView: CalendarView;
  setSelectedDate: (date: Date) => void;
  setCurrentView: (view: CalendarView) => void;
  goToToday: () => void;
  goToPrevious: () => void;
  goToNext: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Derive state directly from URL params (URL is the source of truth)
  // This avoids the need for useState + useEffect sync which can cause loops
  const selectedDate = useMemo(() => {
    const dateParam = searchParams.get('date');
    if (dateParam) {
      const parsed = parseISO(dateParam);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    return startOfToday();
  }, [searchParams]);

  const currentView = useMemo((): CalendarView => {
    const viewParam = searchParams.get('view');
    if (viewParam === 'month' || viewParam === 'week' || viewParam === 'day') {
      return viewParam;
    }
    return 'month';
  }, [searchParams]);

  // Update URL to change date - URL is the source of truth, state derives from it
  // Uses replace: false to create history entries for explicit user navigation (clicking dates/views)
  const setSelectedDate = useCallback((date: Date) => {
    setSearchParams((prev) => {
      prev.set('date', format(date, 'yyyy-MM-dd'));
      return prev;
    }, { replace: false });
  }, [setSearchParams]);

  const setCurrentView = useCallback((view: CalendarView) => {
    setSearchParams((prev) => {
      prev.set('view', view);
      return prev;
    }, { replace: false });
  }, [setSearchParams]);

  const goToToday = useCallback(() => {
    setSearchParams((prev) => {
      prev.set('date', format(startOfToday(), 'yyyy-MM-dd'));
      return prev;
    }, { replace: true });
  }, [setSearchParams]);

  // goToPrevious and goToNext use replace: true to avoid polluting history
  // with incremental navigation (pressing prev/next repeatedly)
  const goToPrevious = useCallback(() => {
    let newDate: Date;
    switch (currentView) {
      case 'month':
        newDate = subMonths(selectedDate, 1);
        break;
      case 'week':
        newDate = subWeeks(selectedDate, 1);
        break;
      case 'day':
        newDate = subDays(selectedDate, 1);
        break;
    }
    setSearchParams((prev) => {
      prev.set('date', format(newDate, 'yyyy-MM-dd'));
      return prev;
    }, { replace: true });
  }, [currentView, selectedDate, setSearchParams]);

  const goToNext = useCallback(() => {
    let newDate: Date;
    switch (currentView) {
      case 'month':
        newDate = addMonths(selectedDate, 1);
        break;
      case 'week':
        newDate = addWeeks(selectedDate, 1);
        break;
      case 'day':
        newDate = addDays(selectedDate, 1);
        break;
    }
    setSearchParams((prev) => {
      prev.set('date', format(newDate, 'yyyy-MM-dd'));
      return prev;
    }, { replace: true });
  }, [currentView, selectedDate, setSearchParams]);

  const value = useMemo(
    () => ({
      selectedDate,
      currentView,
      setSelectedDate,
      setCurrentView,
      goToToday,
      goToPrevious,
      goToNext,
    }),
    [selectedDate, currentView, setSelectedDate, setCurrentView, goToToday, goToPrevious, goToNext]
  );

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}
