import { Flame, Trophy, Target, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { DashboardStreaks } from '@/types/dashboard';

interface StreakWidgetProps {
  data?: DashboardStreaks;
  isLoading?: boolean;
}

export function StreakWidget({ data, isLoading }: StreakWidgetProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="p-4 pb-2">
          <Skeleton className="h-5 w-24" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      icon: Flame,
      value: data?.currentStreak ?? 0,
      label: 'Current Streak',
      description: 'Consecutive days',
      tooltip: 'Number of consecutive days you completed all your time blocks. Days without any time blocks are skipped.',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      iconColor: 'text-orange-500',
    },
    {
      icon: Trophy,
      value: data?.longestStreak ?? 0,
      label: 'Longest Streak',
      description: 'Personal best',
      tooltip: 'The longest consecutive streak of completed days you have ever achieved.',
      bgColor: 'bg-amber-100 dark:bg-amber-900/20',
      iconColor: 'text-amber-500',
    },
    {
      icon: CheckCircle2,
      value: data?.totalCompletedDays ?? 0,
      label: 'Days Completed',
      description: 'All time',
      tooltip: 'Total number of days where you completed all your time blocks.',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      iconColor: 'text-green-500',
    },
    {
      icon: Target,
      value: `${Math.round(data?.overallDayCompletionRate ?? 0)}%`,
      label: 'Completion Rate',
      description: 'Of planned days',
      tooltip: 'Percentage of days with time blocks that you fully completed. Days without time blocks are not counted.',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      iconColor: 'text-blue-500',
    },
  ];

  return (
    <Card>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg">Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <TooltipProvider>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Tooltip key={stat.label}>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-3 rounded-lg border p-3 cursor-default">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${stat.bgColor}`}
                      >
                        <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xl font-bold sm:text-2xl">{stat.value}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {stat.label}
                        </p>
                        <p className="truncate text-[10px] text-muted-foreground/70">
                          {stat.description}
                        </p>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-52">
                    <p className="text-xs">{stat.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
