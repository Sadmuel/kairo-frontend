import { Repeat } from 'lucide-react';
import type { EventOccurrence } from '@/types/calendar';
import { cn } from '@/lib/utils';

interface EventBadgeProps {
  event: EventOccurrence;
  onClick?: () => void;
}

export function EventBadge({ event, onClick }: EventBadgeProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium truncate max-w-full',
        'hover:opacity-80 transition-opacity',
        'text-left'
      )}
      style={{
        backgroundColor: event.color || '#A5D8FF',
        color: getContrastColor(event.color || '#A5D8FF'),
      }}
      title={event.title}
    >
      {event.isRecurring && <Repeat className="h-3 w-3 shrink-0" />}
      <span className="truncate">{event.title}</span>
    </button>
  );
}

// Helper to determine if text should be dark or light based on background color
function getContrastColor(hexColor: string): string {
  // Remove # if present
  const hex = hexColor.replace('#', '');

  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return dark text for light backgrounds, light text for dark backgrounds
  return luminance > 0.5 ? '#1f2937' : '#ffffff';
}
