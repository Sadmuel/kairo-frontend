import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useCalendar } from '@/hooks/use-calendar';
import type { CalendarView } from '@/types/calendar';

export function CalendarHeader() {
  const {
    selectedDate,
    currentView,
    setCurrentView,
    goToToday,
    goToPrevious,
    goToNext,
  } = useCalendar();

  const getTitle = () => {
    switch (currentView) {
      case 'month':
        return format(selectedDate, 'MMMM yyyy');
      case 'week':
        return format(selectedDate, "'Week of' MMM d, yyyy");
      case 'day':
        return format(selectedDate, 'EEEE, MMMM d, yyyy');
    }
  };

  // Shorter title for mobile
  const getMobileTitle = () => {
    switch (currentView) {
      case 'month':
        return format(selectedDate, 'MMM yyyy');
      case 'week':
        return format(selectedDate, "'Week' MMM d");
      case 'day':
        return format(selectedDate, 'EEE, MMM d');
    }
  };

  return (
    <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Navigation and title row */}
      <div className="flex items-center justify-between sm:justify-start sm:gap-4">
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrevious}
            className="h-10 w-10 sm:h-9 sm:w-9"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={goToToday}
            className="h-10 px-3 sm:h-9"
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNext}
            className="h-10 w-10 sm:h-9 sm:w-9"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <h2 className="text-base font-semibold sm:hidden">{getMobileTitle()}</h2>
        <h2 className="hidden text-xl font-semibold sm:block">{getTitle()}</h2>
      </div>

      {/* View toggle */}
      <ToggleGroup
        type="single"
        value={currentView}
        onValueChange={(value) => {
          if (value) setCurrentView(value as CalendarView);
        }}
        className="justify-center sm:justify-end"
      >
        <ToggleGroupItem
          value="month"
          aria-label="Month view"
          className="h-10 px-3 sm:h-9"
        >
          Month
        </ToggleGroupItem>
        <ToggleGroupItem
          value="week"
          aria-label="Week view"
          className="h-10 px-3 sm:h-9"
        >
          Week
        </ToggleGroupItem>
        <ToggleGroupItem
          value="day"
          aria-label="Day view"
          className="h-10 px-3 sm:h-9"
        >
          Day
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
