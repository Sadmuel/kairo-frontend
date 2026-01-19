import { CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface CompletionRateCardProps {
  title: string;
  todoRate: number;
  timeBlockRate: number;
  completedTodos: number;
  totalTodos: number;
  completedTimeBlocks: number;
  totalTimeBlocks: number;
  isLoading?: boolean;
}

function ProgressBar({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <div className="h-2 w-full rounded-full bg-muted">
      <div
        className={cn('h-2 rounded-full transition-all', className)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function CompletionRateCard({
  title,
  todoRate,
  timeBlockRate,
  completedTodos,
  totalTodos,
  completedTimeBlocks,
  totalTimeBlocks,
  isLoading,
}: CompletionRateCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="p-4 sm:p-6 pb-2">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6 pb-2">
        <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4">
        {/* Todo Completion */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Todos</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {completedTodos}/{totalTodos} ({Math.round(todoRate)}%)
            </span>
          </div>
          <ProgressBar value={todoRate} className="bg-green-500" />
        </div>

        {/* Time Block Completion */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Time Blocks</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {completedTimeBlocks}/{totalTimeBlocks} (
              {Math.round(timeBlockRate)}%)
            </span>
          </div>
          <ProgressBar value={timeBlockRate} className="bg-blue-500" />
        </div>
      </CardContent>
    </Card>
  );
}
