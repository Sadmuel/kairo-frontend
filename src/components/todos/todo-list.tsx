import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TodoCard } from './todo-card';
import { TodoForm } from './todo-form';
import { useReorderTodos } from '@/hooks/use-todos';
import type { Todo } from '@/types/calendar';

interface TodoListProps {
  todos: Todo[];
  dayId?: string;
  timeBlockId?: string;
  inbox?: boolean;
  showForm?: boolean;
  onBeforeCreate?: () => Promise<{ dayId?: string }>;
}

export function TodoList({
  todos,
  dayId,
  timeBlockId,
  inbox,
  showForm = true,
  onBeforeCreate,
}: TodoListProps) {
  const reorderTodos = useReorderTodos();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = todos.findIndex((t) => t.id === active.id);
      const newIndex = todos.findIndex((t) => t.id === over.id);

      const newOrder = arrayMove(todos, oldIndex, newIndex);
      const orderedIds = newOrder.map((t) => t.id);

      await reorderTodos.mutateAsync({
        context: { dayId, timeBlockId, inbox },
        data: { orderedIds },
      });
    }
  };

  // Sort todos by order
  const sortedTodos = [...todos].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-2">
      {sortedTodos.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedTodos.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-1">
              {sortedTodos.map((todo) => (
                <TodoCard key={todo.id} todo={todo} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {showForm && <TodoForm dayId={dayId} timeBlockId={timeBlockId} onBeforeCreate={onBeforeCreate} />}
    </div>
  );
}
