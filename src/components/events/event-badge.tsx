import { Repeat } from 'lucide-react';
import type { EventOccurrence } from '@/types/calendar';
import { cn } from '@/lib/utils';
import { CALENDAR_COMPACT_ACCENT_WIDTH, getCalendarColorStyle } from '@/lib/calendar-colors';

interface EventBadgeProps {
  event: EventOccurrence;
  onClick?: () => void;
}

export function EventBadge({ event, onClick }: EventBadgeProps) {
  const handleInteraction = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    onClick?.();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleInteraction}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleInteraction(e);
        }
      }}
      className={cn(
        'flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium truncate max-w-full',
        'hover:opacity-80 transition-opacity cursor-pointer',
        'border-l text-left text-card-foreground'
      )}
      style={getCalendarColorStyle(event.color, CALENDAR_COMPACT_ACCENT_WIDTH)}
      title={event.title}
    >
      {event.isRecurring && <Repeat className="h-3 w-3 shrink-0" />}
      <span className="truncate">{event.title}</span>
    </div>
  );
}
