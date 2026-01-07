import { useState } from 'react';
import { ChevronDown, ChevronUp, ListTodo } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TodoList } from './todo-list';
import { useTodosByDay } from '@/hooks/use-todos';

interface DayTodoSectionProps {
  dayId: string;
}

export function DayTodoSection({ dayId }: DayTodoSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { data: todos = [], isLoading } = useTodosByDay(dayId);

  const completedCount = todos.filter((t) => t.isCompleted).length;
  const totalCount = todos.length;

  return (
    <Card className="p-3 sm:p-4">
      <button
        className="flex w-full items-center justify-between text-sm font-medium hover:text-foreground"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="flex items-center gap-2">
          <ListTodo className="h-4 w-4" />
          Day Tasks
          {totalCount > 0 && (
            <span className="text-xs text-muted-foreground font-normal">
              ({completedCount}/{totalCount})
            </span>
          )}
        </span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-3/4" />
            </div>
          ) : (
            <TodoList todos={todos} dayId={dayId} />
          )}
        </div>
      )}
    </Card>
  );
}
