import { useState, FormEvent } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useCreateTodo } from '@/hooks/use-todos';
import { cn } from '@/lib/utils';

interface TodoFormProps {
  dayId?: string;
  timeBlockId?: string;
}

export function TodoForm({ dayId, timeBlockId }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeadline, setShowDeadline] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const createTodo = useCreateTodo();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setError(null);
    try {
      await createTodo.mutateAsync({
        title: title.trim(),
        deadline: deadline || undefined,
        dayId,
        timeBlockId,
      });

      setTitle('');
      setDeadline('');
      setShowDeadline(false);
      setIsExpanded(false);
    } catch (err) {
      console.error('Failed to create todo:', err);
      setError('Failed to create todo. Please try again.');
    }
  };

  const handleReset = () => {
    setTitle('');
    setDeadline('');
    setShowDeadline(false);
    setIsExpanded(false);
    setError(null);
  };

  if (!isExpanded) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-muted-foreground"
        onClick={() => setIsExpanded(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add todo
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex items-center gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a todo..."
          autoFocus
          disabled={createTodo.isPending}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              handleReset();
            }
          }}
          className="h-8 text-sm"
        />
        <Popover open={showDeadline} onOpenChange={setShowDeadline}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className={cn('h-8 w-8', deadline && 'text-primary')}
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3" align="end">
            <div className="space-y-2">
              <label htmlFor="todo-deadline" className="text-sm font-medium">Deadline</label>
              <Input
                id="todo-deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="h-8"
              />
              {deadline && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setDeadline('');
                    setShowDeadline(false);
                  }}
                >
                  Clear deadline
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
        <Button
          type="submit"
          size="sm"
          disabled={createTodo.isPending || !title.trim()}
        >
          Add
        </Button>
      </div>
      {deadline && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground pl-1">
          <Calendar className="h-3 w-3" />
          Due: {(() => {
            const [year, month, day] = deadline.split('-').map(Number);
            return new Date(year, month - 1, day).toLocaleDateString();
          })()}
        </div>
      )}
      {error && (
        <p className="text-xs text-destructive pl-1">{error}</p>
      )}
    </form>
  );
}
