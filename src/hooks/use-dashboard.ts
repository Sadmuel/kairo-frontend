import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard';

// Query key factory for dashboard
export const dashboardKeys = {
  all: ['dashboard'] as const,
  data: () => [...dashboardKeys.all, 'data'] as const,
};

// Get dashboard data
export function useDashboard() {
  return useQuery({
    queryKey: dashboardKeys.data(),
    queryFn: () => dashboardService.get(),
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60, // 1 minute
  });
}
