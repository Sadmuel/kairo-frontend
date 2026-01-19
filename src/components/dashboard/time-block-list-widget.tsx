import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { DashboardTodayDetail, DashboardTimeBlock } from '@/types/dashboard';

interface TimeBlockListWidgetProps {
  data?: DashboardTodayDetail | null;
  isLoading?: boolean;
}

function TimeBlockItem({ block }: { block: DashboardTimeBlock }) {
  const completedTodos = block.todos.filter((t) => t.isCompleted).length;
  const totalTodos = block.todos.length;

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border p-3 transition-colors',
        block.isCompleted && 'bg-muted/50'
      )}
    >
      <div
        className="h-10 w-1 shrink-0 rounded-full"
        style={{ backgroundColor: block.color || '#A5D8FF' }}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {block.isCompleted ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
          ) : (
            <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          <span
            className={cn(
              'truncate font-medium',
              block.isCompleted && 'text-muted-foreground line-through'
            )}
          >
            {block.name}
          </span>
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
          <span>
            {block.startTime} - {block.endTime}
          </span>
          {totalTodos > 0 && (
            <>
              <span>·</span>
              <span>
                {completedTodos}/{totalTodos} todos
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function TimeBlockListWidget({ data, isLoading }: TimeBlockListWidgetProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="p-4 pb-2">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg">Today's Schedule</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No schedule for today</p>
            <p className="text-xs text-muted-foreground">
              Create a day to add time blocks
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sortedBlocks = [...data.timeBlocks].sort((a, b) => a.order - b.order);
  const hasBlocks = sortedBlocks.length > 0;

  return (
    <Card>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Today's Schedule</CardTitle>
          <Link
            to="/calendar"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            View all
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {hasBlocks ? (
          <div className="space-y-2">
            {sortedBlocks.slice(0, 5).map((block) => (
              <TimeBlockItem key={block.id} block={block} />
            ))}
            {sortedBlocks.length > 5 && (
              <p className="text-center text-xs text-muted-foreground">
                +{sortedBlocks.length - 5} more time blocks
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-sm text-muted-foreground">No time blocks today</p>
            <p className="text-xs text-muted-foreground">
              Add time blocks in the calendar
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
