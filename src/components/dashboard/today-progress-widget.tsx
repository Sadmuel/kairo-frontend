import { CheckCircle2, Clock, ListTodo } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { DashboardTodayStats } from '@/types/dashboard';

interface TodayProgressWidgetProps {
  data?: DashboardTodayStats;
  isLoading?: boolean;
}

function CircularProgress({
  value,
  size = 80,
  strokeWidth = 8,
  className,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={cn('relative', className)} style={{ width: size, height: size }}>
      <svg className="rotate-[-90deg]" width={size} height={size}>
        <circle
          className="text-muted"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-green-500 transition-all duration-500"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold">{Math.round(value)}%</span>
      </div>
    </div>
  );
}

function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className="h-2 w-full rounded-full bg-muted">
      <div
        className={cn('h-2 rounded-full transition-all duration-300', className)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function TodayProgressWidget({ data, isLoading }: TodayProgressWidgetProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="p-4 pb-2">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex items-center gap-6">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data?.dayExists) {
    return (
      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg">Today's Progress</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <ListTodo className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No day created yet</p>
            <p className="text-xs text-muted-foreground">
              Create a day in the calendar to start tracking
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate overall progress (average of todo and time block rates)
  const overallProgress =
    data.totalTodos + data.totalTimeBlocks > 0
      ? (data.todoCompletionRate + data.timeBlockCompletionRate) / 2
      : 0;

  return (
    <Card>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Today's Progress</CardTitle>
          {data.isCompleted && (
            <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
              <CheckCircle2 className="h-3 w-3" />
              Completed
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center gap-4 sm:gap-6">
          <CircularProgress value={overallProgress} />
          <div className="flex-1 space-y-3">
            {/* Todos progress */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5">
                  <ListTodo className="h-4 w-4 text-green-500" />
                  Todos
                </span>
                <span className="text-muted-foreground">
                  {data.completedTodos}/{data.totalTodos}
                </span>
              </div>
              <ProgressBar value={data.todoCompletionRate} className="bg-green-500" />
            </div>

            {/* Time blocks progress */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-blue-500" />
                  Time Blocks
                </span>
                <span className="text-muted-foreground">
                  {data.completedTimeBlocks}/{data.totalTimeBlocks}
                </span>
              </div>
              <ProgressBar value={data.timeBlockCompletionRate} className="bg-blue-500" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
