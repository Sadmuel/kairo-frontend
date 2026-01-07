import { useState } from 'react';
import { GripVertical, Pencil, Trash2, Check, X, Calendar } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useUpdateTodo, useDeleteTodo } from '@/hooks/use-todos';
import type { Todo } from '@/types/calendar';
import { cn } from '@/lib/utils';

interface TodoCardProps {
  todo: Todo;
}

export function TodoCard({ todo }: TodoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleToggleComplete = async () => {
    await updateTodo.mutateAsync({
      id: todo.id,
      data: { isCompleted: !todo.isCompleted },
    });
  };

  const handleSave = async () => {
    if (!editTitle.trim()) {
      return;
    }
    await updateTodo.mutateAsync({
      id: todo.id,
      data: { title: editTitle },
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await deleteTodo.mutateAsync(todo.id);
  };

  const isOverdue =
    todo.deadline && !todo.isCompleted && new Date(todo.deadline) < new Date();

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex items-center gap-1 rounded-md py-1 px-1 -mx-1 hover:bg-muted/50 sm:gap-2 sm:px-2 sm:-mx-2',
        isDragging && 'opacity-50'
      )}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="flex h-8 w-8 cursor-grab items-center justify-center touch-none text-muted-foreground opacity-100 sm:h-6 sm:w-6 sm:opacity-0 sm:group-hover:opacity-100"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Checkbox */}
      <Checkbox
        checked={todo.isCompleted}
        onCheckedChange={handleToggleComplete}
        disabled={updateTodo.isPending}
        className="h-5 w-5 sm:h-4 sm:w-4"
      />

      {isEditing ? (
        <div className="flex flex-1 items-center gap-1">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
            autoFocus
            disabled={updateTodo.isPending}
            className="h-10 text-sm sm:h-9"
          />
          <Button
            size="icon"
            variant="ghost"
            className="h-10 w-10 sm:h-9 sm:w-9"
            onClick={handleSave}
            disabled={updateTodo.isPending}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-10 w-10 sm:h-9 sm:w-9"
            onClick={handleCancel}
            disabled={updateTodo.isPending}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-1 flex-col gap-0.5 min-w-0">
            <span
              className={cn(
                'text-sm py-1 truncate',
                todo.isCompleted && 'line-through text-muted-foreground'
              )}
            >
              {todo.title}
            </span>
            {todo.deadline && (
              <span
                className={cn(
                  'flex items-center gap-1 text-xs text-muted-foreground',
                  isOverdue && 'text-destructive'
                )}
              >
                <Calendar className="h-3 w-3" />
                {formatDeadline(todo.deadline)}
              </span>
            )}
          </div>
          {/* Action buttons */}
          <div className="flex items-center gap-0 opacity-100 sm:gap-1 sm:opacity-0 sm:group-hover:opacity-100">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 sm:h-7 sm:w-7"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-3.5 w-3.5 sm:h-3 sm:w-3" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-destructive hover:text-destructive sm:h-7 sm:w-7"
              onClick={handleDelete}
              disabled={deleteTodo.isPending}
            >
              <Trash2 className="h-3.5 w-3.5 sm:h-3 sm:w-3" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
