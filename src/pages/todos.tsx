import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { TodoListSkeleton } from '@/components/ui/skeletons';
import { TodoList } from '@/components/todos/todo-list';
import { useInboxTodos } from '@/hooks/use-todos';
import { useDocumentTitle } from '@/hooks/use-document-title';

type FilterType = 'active' | 'completed' | 'all';

export default function TodosPage() {
  useDocumentTitle('Inbox');
  const [filter, setFilter] = useState<FilterType>('active');

  const filterQuery =
    filter === 'all' ? undefined : { isCompleted: filter === 'completed' };

  const { data: todos = [], isLoading, error, refetch } = useInboxTodos(filterQuery);

  const handleFilterChange = (value: string) => {
    if (value) {
      setFilter(value as FilterType);
    }
  };

  return (
    <main className="container mx-auto max-w-2xl px-3 py-4 sm:px-4 sm:py-6">
      <div className="space-y-6">
        {/* Filter tabs */}
        <ToggleGroup
          type="single"
          value={filter}
          onValueChange={handleFilterChange}
          className="justify-start"
        >
          <ToggleGroupItem value="active" className="h-9 px-4">
            Active
          </ToggleGroupItem>
          <ToggleGroupItem value="completed" className="h-9 px-4">
            Completed
          </ToggleGroupItem>
          <ToggleGroupItem value="all" className="h-9 px-4">
            All
          </ToggleGroupItem>
        </ToggleGroup>

        {/* Todo list */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">
              {filter === 'active' && 'Active Todos'}
              {filter === 'completed' && 'Completed Todos'}
              {filter === 'all' && 'All Todos'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            {isLoading ? (
              <TodoListSkeleton count={5} />
            ) : error ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Failed to load todos</p>
                  <p className="text-xs text-muted-foreground">
                    Something went wrong. Please try again.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  Retry
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {todos.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-4">
                    {filter === 'active' && 'No active todos.'}
                    {filter === 'completed' && 'No completed todos yet.'}
                    {filter === 'all' && 'No todos yet.'}
                  </p>
                )}
                <TodoList todos={todos} inbox />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
