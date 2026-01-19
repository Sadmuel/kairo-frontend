import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCalendar } from '../use-calendar';
import { CalendarProvider } from '@/context/calendar-context';
import { MemoryRouter } from 'react-router-dom';
import { ReactNode } from 'react';

function wrapper({ children }: { children: ReactNode }) {
  return (
    <MemoryRouter>
      <CalendarProvider>{children}</CalendarProvider>
    </MemoryRouter>
  );
}

describe('useCalendar', () => {
  it('returns calendar context values', () => {
    const { result } = renderHook(() => useCalendar(), { wrapper });

    expect(result.current).toHaveProperty('selectedDate');
    expect(result.current).toHaveProperty('currentView');
    expect(result.current).toHaveProperty('setSelectedDate');
    expect(result.current).toHaveProperty('setCurrentView');
    expect(result.current).toHaveProperty('goToToday');
    expect(result.current).toHaveProperty('goToPrevious');
    expect(result.current).toHaveProperty('goToNext');
  });

  it('throws error when used outside CalendarProvider', () => {
    expect(() => {
      renderHook(() => useCalendar(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <MemoryRouter>{children}</MemoryRouter>
        ),
      });
    }).toThrow('useCalendar must be used within a CalendarProvider');
  });
});
