import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Skeleton } from '@/components/ui/skeleton';
import {
  StreakCard,
  CompletionRateCard,
  WeeklyBarChart,
} from '@/components/stats';
import {
  useOverallStats,
  useTodayStats,
  useThisWeekStats,
} from '@/hooks/use-stats';

type TimePeriod = 'today' | 'week' | 'overall';

export default function StatsPage() {
  const [period, setPeriod] = useState<TimePeriod>('week');

  const {
    data: overallStats,
    isLoading: isLoadingOverall,
    error: overallError,
    refetch: refetchOverall,
  } = useOverallStats();

  const {
    data: todayStats,
    isLoading: isLoadingToday,
    error: todayError,
    refetch: refetchToday,
  } = useTodayStats();

  const {
    data: weekStats,
    isLoading: isLoadingWeek,
    error: weekError,
    refetch: refetchWeek,
  } = useThisWeekStats();

  const handlePeriodChange = (value: string) => {
    if (value) {
      setPeriod(value as TimePeriod);
    }
  };

  const handleRetry = () => {
    refetchOverall();
    refetchToday();
    refetchWeek();
  };

  const hasError = overallError || todayError || weekError;

  return (
    <main className="container mx-auto max-w-4xl px-3 py-4 sm:px-4 sm:py-6">
      {hasError ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-6 text-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Failed to load statistics</p>
              <p className="text-xs text-muted-foreground">
                Something went wrong. Please try again.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleRetry}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Streak Section - Always visible */}
          <StreakCard
            currentStreak={overallStats?.currentStreak ?? 0}
            longestStreak={overallStats?.longestStreak ?? 0}
            isLoading={isLoadingOverall}
          />

          {/* Overall Day Completion Rate */}
          <Card>
            <CardHeader className="p-4 sm:p-6 pb-2">
              <CardTitle className="text-lg sm:text-xl">
                Overall Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              {isLoadingOverall ? (
                <Skeleton className="h-20 w-full" />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold">
                      {Math.round(
                        overallStats?.overallDayCompletionRate ?? 0
                      )}
                      %
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Day Completion
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold">
                      {overallStats?.totalCompletedDays ?? 0}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Days Completed
                    </p>
                  </div>
                  <div className="text-center col-span-2 sm:col-span-1">
                    <p className="text-3xl font-bold">
                      {overallStats?.totalDays ?? 0}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Total Days
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Period Filter */}
          <ToggleGroup
            type="single"
            value={period}
            onValueChange={handlePeriodChange}
            className="justify-start"
          >
            <ToggleGroupItem value="today" className="h-9 px-4">
              Today
            </ToggleGroupItem>
            <ToggleGroupItem value="week" className="h-9 px-4">
              This Week
            </ToggleGroupItem>
            <ToggleGroupItem value="overall" className="h-9 px-4">
              All Time
            </ToggleGroupItem>
          </ToggleGroup>

          {/* Period-specific content */}
          {period === 'today' && (
            <CompletionRateCard
              title={`Today (${format(new Date(), 'MMM d')})`}
              todoRate={todayStats?.todoCompletionRate ?? 0}
              timeBlockRate={todayStats?.timeBlockCompletionRate ?? 0}
              completedTodos={todayStats?.completedTodos ?? 0}
              totalTodos={todayStats?.totalTodos ?? 0}
              completedTimeBlocks={todayStats?.completedTimeBlocks ?? 0}
              totalTimeBlocks={todayStats?.totalTimeBlocks ?? 0}
              isLoading={isLoadingToday}
            />
          )}

          {period === 'week' && (
            <>
              <CompletionRateCard
                title={
                  weekStats
                    ? `${format(new Date(weekStats.weekStart), 'MMM d')} - ${format(new Date(weekStats.weekEnd), 'MMM d')}`
                    : 'This Week'
                }
                todoRate={weekStats?.todoCompletionRate ?? 0}
                timeBlockRate={weekStats?.timeBlockCompletionRate ?? 0}
                completedTodos={weekStats?.completedTodos ?? 0}
                totalTodos={weekStats?.totalTodos ?? 0}
                completedTimeBlocks={weekStats?.completedTimeBlocks ?? 0}
                totalTimeBlocks={weekStats?.totalTimeBlocks ?? 0}
                isLoading={isLoadingWeek}
              />
              <WeeklyBarChart
                dailyStats={weekStats?.dailyStats ?? []}
                isLoading={isLoadingWeek}
              />
            </>
          )}

          {period === 'overall' && (
            <Card>
              <CardHeader className="p-4 sm:p-6 pb-2">
                <CardTitle className="text-lg sm:text-xl">
                  All Time Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                {isLoadingOverall ? (
                  <Skeleton className="h-24 w-full" />
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {overallStats?.lastCompletedDate
                        ? `Last completed day: ${format(new Date(overallStats.lastCompletedDate), 'MMMM d, yyyy')}`
                        : 'No days completed yet'}
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg border p-4 text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {overallStats?.totalCompletedDays ?? 0}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Completed Days
                        </p>
                      </div>
                      <div className="rounded-lg border p-4 text-center">
                        <p className="text-2xl font-bold">
                          {Math.round(
                            overallStats?.overallDayCompletionRate ?? 0
                          )}
                          %
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Completion Rate
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </main>
  );
}
