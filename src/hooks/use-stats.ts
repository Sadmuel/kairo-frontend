import { useQuery } from '@tanstack/react-query';
import { statsService } from '@/services/stats';
import { format, startOfWeek } from 'date-fns';

// Query key factory for stats
export const statsKeys = {
  all: ['stats'] as const,
  overall: () => [...statsKeys.all, 'overall'] as const,
  day: (date: string) => [...statsKeys.all, 'day', date] as const,
  week: (date: string) => [...statsKeys.all, 'week', date] as const,
};

// Get overall user statistics
export function useOverallStats() {
  return useQuery({
    queryKey: statsKeys.overall(),
    queryFn: () => statsService.getOverall(),
  });
}

// Get day-specific statistics
export function useDayStats(date: Date) {
  const dateStr = format(date, 'yyyy-MM-dd');

  return useQuery({
    queryKey: statsKeys.day(dateStr),
    queryFn: () => statsService.getDay(dateStr),
  });
}

// Get week statistics
export function useWeekStats(date: Date) {
  // Normalize to week start for consistent caching
  const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Monday
  const dateStr = format(weekStart, 'yyyy-MM-dd');

  return useQuery({
    queryKey: statsKeys.week(dateStr),
    queryFn: () => statsService.getWeek(dateStr),
  });
}

// Convenience hook for today's stats
export function useTodayStats() {
  return useDayStats(new Date());
}

// Convenience hook for this week's stats
export function useThisWeekStats() {
  return useWeekStats(new Date());
}
