import { Skeleton } from './skeleton';
import { Card, CardContent, CardHeader } from './card';

// Time Block Skeleton
export function TimeBlockSkeleton() {
  return (
    <Card>
      <div className="flex items-start gap-2 border-l-4 border-l-muted p-3 sm:gap-3 sm:p-4">
        <Skeleton className="h-10 w-10 shrink-0 sm:h-5 sm:w-5" />
        <Skeleton className="mt-0.5 h-10 w-10 shrink-0 rounded sm:h-4 sm:w-4" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex gap-1">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>
    </Card>
  );
}

// Time Block List Skeleton
export function TimeBlockListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <TimeBlockSkeleton key={i} />
      ))}
    </div>
  );
}

// Todo Item Skeleton
export function TodoItemSkeleton() {
  return (
    <div className="flex items-center gap-2 py-1 px-1 sm:gap-2 sm:px-2">
      <Skeleton className="h-8 w-8 sm:h-6 sm:w-6" />
      <Skeleton className="h-5 w-5 rounded sm:h-4 sm:w-4" />
      <Skeleton className="h-4 flex-1" />
      <Skeleton className="h-7 w-7" />
      <Skeleton className="h-7 w-7" />
    </div>
  );
}

// Todo List Skeleton
export function TodoListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-1">
      {Array.from({ length: count }).map((_, i) => (
        <TodoItemSkeleton key={i} />
      ))}
    </div>
  );
}

// Event Card Skeleton
export function EventCardSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <Skeleton className="h-10 w-10 rounded-lg" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

// Events List Skeleton
export function EventsListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Calendar Day Cell Skeleton
export function CalendarDayCellSkeleton() {
  return (
    <div className="h-24 rounded-md border p-1">
      <Skeleton className="h-5 w-5 rounded-full" />
      <div className="mt-1 space-y-0.5">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

// Calendar Month Grid Skeleton
export function CalendarGridSkeleton() {
  return (
    <div className="grid grid-cols-7 gap-1">
      {/* Header row */}
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
        <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
          {day}
        </div>
      ))}
      {/* Day cells - 5 weeks */}
      {Array.from({ length: 35 }).map((_, i) => (
        <CalendarDayCellSkeleton key={i} />
      ))}
    </div>
  );
}

// Day View Skeleton (for calendar day view)
export function DayViewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-32" />
      </div>
      <TimeBlockListSkeleton count={4} />
    </div>
  );
}

// Dashboard Widget Skeleton
export function DashboardWidgetSkeleton() {
  return (
    <Card>
      <CardHeader className="p-4 pb-2">
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <Skeleton className="h-20 w-full" />
      </CardContent>
    </Card>
  );
}

// Full Dashboard Skeleton
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-40" />
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        <div className="space-y-4 sm:space-y-6">
          <DashboardWidgetSkeleton />
          <DashboardWidgetSkeleton />
        </div>
        <div className="space-y-4 sm:space-y-6">
          <DashboardWidgetSkeleton />
          <DashboardWidgetSkeleton />
        </div>
      </div>
    </div>
  );
}

// Stats Page Skeleton
export function StatsPageSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="p-4 sm:p-6 pb-2">
          <Skeleton className="h-5 w-24" />
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="p-4 sm:p-6 pb-2">
          <Skeleton className="h-5 w-36" />
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

// Inbox Page Skeleton
export function InboxPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-9 w-28" />
      </div>
      <Card>
        <CardContent className="p-4">
          <TodoListSkeleton count={6} />
        </CardContent>
      </Card>
    </div>
  );
}
