import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
} from 'date-fns';

// Format date for API (YYYY-MM-DD)
export function formatDateForApi(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

// Format date for display
export function formatDateDisplay(date: Date, formatStr: string): string {
  return format(date, formatStr);
}

// Get all days in a month view (including padding days)
export function getMonthViewDays(date: Date): Date[] {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const viewStart = startOfWeek(monthStart);
  const viewEnd = endOfWeek(monthEnd);

  return eachDayOfInterval({ start: viewStart, end: viewEnd });
}

// Get all days in a week
export function getWeekDays(date: Date): Date[] {
  const weekStart = startOfWeek(date);
  const weekEnd = endOfWeek(date);

  return eachDayOfInterval({ start: weekStart, end: weekEnd });
}

// Format time for display (6:00 AM)
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

// Calculate time block height percentage (for visual positioning)
export function getTimeBlockPosition(
  startTime: string,
  endTime: string,
  dayStart = '06:00',
  dayEnd = '22:00'
): { top: number; height: number } {
  const toMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const dayStartMinutes = toMinutes(dayStart);
  const dayEndMinutes = toMinutes(dayEnd);
  const totalMinutes = dayEndMinutes - dayStartMinutes;

  const blockStartMinutes = toMinutes(startTime);
  const blockEndMinutes = toMinutes(endTime);

  const top = ((blockStartMinutes - dayStartMinutes) / totalMinutes) * 100;
  const height = ((blockEndMinutes - blockStartMinutes) / totalMinutes) * 100;

  return { top: Math.max(0, top), height: Math.min(100 - top, height) };
}

export { isSameDay, isSameMonth, isToday, parseISO };
