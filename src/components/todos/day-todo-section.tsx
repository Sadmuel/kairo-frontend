import { useState, useCallback, useRef } from 'react';
import { ChevronDown, ListTodo } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { CollapsibleContent } from '@/components/ui/collapsible-content';
import { Skeleton } from '@/components/ui/skeleton';
import { TodoList } from './todo-list';
import { useTodosByDay } from '@/hooks/use-todos';

interface DayTodoSectionProps {
  dayId?: string;
  ensureDayId: () => Promise<string>;
}

export function DayTodoSection({ dayId, ensureDayId }: DayTodoSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { data: todos = [], isLoading } = useTodosByDay(dayId);
  const contentId = `day-todos-${dayId ?? 'new'}`;

  const onBeforeCreate = useCallback(async () => {
    const id = await ensureDayId();
    return { dayId: id };
  }, [ensureDayId]);

  const completedCount = todos.filter((t) => t.isCompleted).length;
  const totalCount = todos.length;

  return (
    <Card className="p-3 sm:p-4">
      <button
        ref={triggerRef}
        type="button"
        className="flex w-full items-center justify-between text-sm font-medium hover:text-foreground"
        onClick={(event) => {
          if (isExpanded) event.currentTarget.focus();
          setIsExpanded(!isExpanded);
        }}
        aria-expanded={isExpanded}
        aria-controls={contentId}
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
        <ChevronDown
          className="h-4 w-4 collapsible-chevron"
          data-expanded={isExpanded}
        />
      </button>

      <CollapsibleContent id={contentId} open={isExpanded} triggerRef={triggerRef}>
        <div className="mt-3 pt-3 border-t">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-3/4" />
            </div>
          ) : (
            <TodoList
              todos={todos}
              dayId={dayId}
              onBeforeCreate={onBeforeCreate}
            />
          )}
        </div>
      </CollapsibleContent>
    </Card>
  );
}
