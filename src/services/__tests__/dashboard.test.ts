import { describe, it, expect } from 'vitest';
import { dashboardService } from '../dashboard';
import { mockDashboardResponse } from '@/test/mocks/handlers';

describe('dashboardService', () => {
  describe('get', () => {
    it('fetches dashboard data', async () => {
      const result = await dashboardService.get();

      expect(result).toEqual(mockDashboardResponse);
      expect(result.streaks.currentStreak).toBe(5);
      expect(result.today.completedTodos).toBe(5);
      expect(result.upcomingEvents).toHaveLength(1);
    });

    it('includes today detail with time blocks', async () => {
      const result = await dashboardService.get();

      expect(result.todayDetail).not.toBeNull();
      expect(result.todayDetail?.timeBlocks).toHaveLength(1);
      expect(result.todayDetail?.timeBlocks[0].name).toBe('Morning Routine');
    });
  });
});
