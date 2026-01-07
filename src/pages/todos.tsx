import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Skeleton } from '@/components/ui/skeleton';
import { TodoList } from '@/components/todos/todo-list';
import { TodoForm } from '@/components/todos/todo-form';
import { useInboxTodos } from '@/hooks/use-todos';

type FilterType = 'active' | 'completed' | 'all';

export default function TodosPage() {
  const [filter, setFilter] = useState<FilterType>('active');

  const filterQuery =
    filter === 'all' ? undefined : { isCompleted: filter === 'completed' };

  const { data: todos = [], isLoading } = useInboxTodos(filterQuery);

  const handleFilterChange = (value: string) => {
    if (value) {
      setFilter(value as FilterType);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header - standardized with calendar page */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 max-w-6xl items-center gap-4 px-3 sm:px-4">
          <Button variant="ghost" size="icon" asChild className="h-10 w-10 sm:h-9 sm:w-9">
            <Link to="/dashboard">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to Dashboard</span>
            </Link>
          </Button>
          <h1 className="text-lg font-semibold sm:text-xl">Inbox</h1>
        </div>
      </header>

      {/* Content */}
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
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-3/4" />
                </div>
              ) : (
                <div className="space-y-4">
                  {todos.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-4">
                      {filter === 'active' && 'No active todos.'}
                      {filter === 'completed' && 'No completed todos yet.'}
                      {filter === 'all' && 'No todos yet.'}
                    </p>
                  ) : (
                    <TodoList todos={todos} inbox showForm={false} />
                  )}
                  {/* Always show the add form for inbox */}
                  <TodoForm />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
