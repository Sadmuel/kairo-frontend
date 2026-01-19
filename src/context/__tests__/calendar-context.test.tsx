import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CalendarProvider, CalendarContext } from '../calendar-context';
import { useContext, ReactNode } from 'react';
import { format } from 'date-fns';

// Helper to use the calendar context
function useCalendar() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within CalendarProvider');
  }
  return context;
}

function createWrapper(initialEntries: string[] = ['/']) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={initialEntries}>
        <CalendarProvider>{children}</CalendarProvider>
      </MemoryRouter>
    );
  };
}

describe('CalendarContext', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2024, 0, 15)); // January 15, 2024
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('CalendarProvider', () => {
    it('provides default date as today when no URL params', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(),
      });

      expect(format(result.current.selectedDate, 'yyyy-MM-dd')).toBe('2024-01-15');
    });

    it('provides default view as month when no URL params', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(),
      });

      expect(result.current.currentView).toBe('month');
    });

    it('reads date from URL params', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(['/?date=2024-03-20']),
      });

      expect(format(result.current.selectedDate, 'yyyy-MM-dd')).toBe('2024-03-20');
    });

    it('reads view from URL params', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(['/?view=week']),
      });

      expect(result.current.currentView).toBe('week');
    });

    it('handles invalid date in URL params gracefully', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(['/?date=invalid-date']),
      });

      // Should fall back to today
      expect(format(result.current.selectedDate, 'yyyy-MM-dd')).toBe('2024-01-15');
    });

    it('handles invalid view in URL params gracefully', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(['/?view=invalid']),
      });

      // Should fall back to month
      expect(result.current.currentView).toBe('month');
    });
  });

  describe('setSelectedDate', () => {
    it('updates the selected date', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setSelectedDate(new Date(2024, 5, 20));
      });

      expect(format(result.current.selectedDate, 'yyyy-MM-dd')).toBe('2024-06-20');
    });
  });

  describe('setCurrentView', () => {
    it('changes view to week', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setCurrentView('week');
      });

      expect(result.current.currentView).toBe('week');
    });

    it('changes view to day', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setCurrentView('day');
      });

      expect(result.current.currentView).toBe('day');
    });
  });

  describe('goToToday', () => {
    it('navigates to today date', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(['/?date=2024-06-15']),
      });

      act(() => {
        result.current.goToToday();
      });

      expect(format(result.current.selectedDate, 'yyyy-MM-dd')).toBe('2024-01-15');
    });
  });

  describe('goToPrevious', () => {
    it('goes to previous month in month view', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(['/?date=2024-03-15&view=month']),
      });

      act(() => {
        result.current.goToPrevious();
      });

      expect(format(result.current.selectedDate, 'yyyy-MM-dd')).toBe('2024-02-15');
    });

    it('goes to previous week in week view', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(['/?date=2024-01-15&view=week']),
      });

      act(() => {
        result.current.goToPrevious();
      });

      expect(format(result.current.selectedDate, 'yyyy-MM-dd')).toBe('2024-01-08');
    });

    it('goes to previous day in day view', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(['/?date=2024-01-15&view=day']),
      });

      act(() => {
        result.current.goToPrevious();
      });

      expect(format(result.current.selectedDate, 'yyyy-MM-dd')).toBe('2024-01-14');
    });
  });

  describe('goToNext', () => {
    it('goes to next month in month view', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(['/?date=2024-01-15&view=month']),
      });

      act(() => {
        result.current.goToNext();
      });

      expect(format(result.current.selectedDate, 'yyyy-MM-dd')).toBe('2024-02-15');
    });

    it('goes to next week in week view', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(['/?date=2024-01-15&view=week']),
      });

      act(() => {
        result.current.goToNext();
      });

      expect(format(result.current.selectedDate, 'yyyy-MM-dd')).toBe('2024-01-22');
    });

    it('goes to next day in day view', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(['/?date=2024-01-15&view=day']),
      });

      act(() => {
        result.current.goToNext();
      });

      expect(format(result.current.selectedDate, 'yyyy-MM-dd')).toBe('2024-01-16');
    });
  });
});
