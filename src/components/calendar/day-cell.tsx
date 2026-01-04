import { cn } from '@/lib/utils';
import { isToday, isSameMonth } from '@/lib/date-utils';
import type { Day } from '@/types/calendar';

interface DayCellProps {
  date: Date;
  currentMonth: Date;
  day?: Day;
  onClick: (date: Date) => void;
}

export function DayCell({ date, currentMonth, day, onClick }: DayCellProps) {
  const isCurrentMonth = isSameMonth(date, currentMonth);
  const isTodayDate = isToday(date);
  const hasTimeBlocks = day && day.timeBlocks.length > 0;
  const isCompleted = day?.isCompleted;

  return (
    <button
      onClick={() => onClick(date)}
      className={cn(
        'relative flex h-16 flex-col items-start p-1 text-left transition-colors hover:bg-muted/50 sm:h-24 sm:p-2',
        'border-b border-r',
        !isCurrentMonth && 'bg-muted/30 text-muted-foreground',
        isTodayDate && 'bg-primary/5'
      )}
    >
      <span
        className={cn(
          'flex h-6 w-6 items-center justify-center rounded-full text-xs sm:h-7 sm:w-7 sm:text-sm',
          isTodayDate && 'bg-primary text-primary-foreground font-semibold'
        )}
      >
        {date.getDate()}
      </span>

      {hasTimeBlocks && (
        <div className="mt-0.5 flex flex-wrap gap-0.5 sm:mt-1 sm:gap-1">
          {day.timeBlocks.slice(0, 3).map((block) => (
            <div
              key={block.id}
              className="h-1 w-1 rounded-full sm:h-1.5 sm:w-1.5"
              style={{ backgroundColor: block.color || '#A5D8FF' }}
            />
          ))}
          {day.timeBlocks.length > 3 && (
            <span className="hidden text-[10px] text-muted-foreground sm:inline">
              +{day.timeBlocks.length - 3}
            </span>
          )}
        </div>
      )}

      {isCompleted && (
        <div className="absolute bottom-0.5 right-0.5 text-green-500 sm:bottom-1 sm:right-1">
          <svg
            className="h-3 w-3 sm:h-4 sm:w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}
    </button>
  );
}
