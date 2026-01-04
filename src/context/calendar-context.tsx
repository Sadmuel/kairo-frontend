import {
  createContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import {
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  startOfToday,
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
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [currentView, setCurrentView] = useState<CalendarView>('month');

  const goToToday = useCallback(() => {
    setSelectedDate(startOfToday());
  }, []);

  const goToPrevious = useCallback(() => {
    setSelectedDate((current) => {
      switch (currentView) {
        case 'month':
          return subMonths(current, 1);
        case 'week':
          return subWeeks(current, 1);
        case 'day':
          return subDays(current, 1);
      }
    });
  }, [currentView]);

  const goToNext = useCallback(() => {
    setSelectedDate((current) => {
      switch (currentView) {
        case 'month':
          return addMonths(current, 1);
        case 'week':
          return addWeeks(current, 1);
        case 'day':
          return addDays(current, 1);
      }
    });
  }, [currentView]);

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
    [selectedDate, currentView, goToToday, goToPrevious, goToNext]
  );

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}
