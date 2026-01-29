import { CheckSquare } from 'lucide-react';
import { CollapsibleSection } from '@/components/ui/collapsible-section';
import { TodoList } from './todo-list';
import type { Todo } from '@/types/calendar';

interface TodoSectionProps {
  timeBlockId: string;
  todos: Todo[];
}

export function TodoSection({ timeBlockId, todos }: TodoSectionProps) {
  const completedCount = todos.filter((t) => t.isCompleted).length;
  const totalCount = todos.length;

  return (
    <CollapsibleSection
      icon={CheckSquare}
      label="Todos"
      badge={totalCount > 0 ? `${completedCount}/${totalCount}` : undefined}
      contentId={`todos-${timeBlockId}`}
    >
      <TodoList todos={todos} timeBlockId={timeBlockId} />
    </CollapsibleSection>
  );
}
