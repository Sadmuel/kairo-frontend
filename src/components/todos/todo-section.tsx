import { useState } from 'react';
import { ChevronDown, ChevronUp, CheckSquare } from 'lucide-react';
import { TodoList } from './todo-list';
import type { Todo } from '@/types/calendar';

interface TodoSectionProps {
  timeBlockId: string;
  todos: Todo[];
}

export function TodoSection({ timeBlockId, todos }: TodoSectionProps) {
  const [isExpanded, setIsExpanded] = useState(todos.length > 0);
  const contentId = `todos-${timeBlockId}`;

  const completedCount = todos.filter((t) => t.isCompleted).length;
  const totalCount = todos.length;

  return (
    <div className="space-y-2">
      <button
        className="flex w-full items-center justify-between text-sm text-muted-foreground hover:text-foreground"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls={contentId}
      >
        <span className="flex items-center gap-1.5">
          <CheckSquare className="h-4 w-4" />
          Todos
          {totalCount > 0 && (
            <span className="text-xs">
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
        <div id={contentId}>
          <TodoList todos={todos} timeBlockId={timeBlockId} />
        </div>
      )}
    </div>
  );
}
