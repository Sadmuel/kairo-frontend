import { format } from 'date-fns';
import { Plus, Check } from 'lucide-react';
import { useCalendar } from '@/hooks/use-calendar';
import { useDayByDate, useCreateDay, useUpdateDay } from '@/hooks/use-days';
import { formatDateForApi } from '@/lib/date-utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TimeBlockList } from '@/components/time-blocks/time-block-list';
import { TimeBlockModal } from '@/components/time-blocks/time-block-modal';
import { DayTodoSection } from '@/components/todos/day-todo-section';
import { EventsSection } from '@/components/events';
import { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function DayView() {
  const { selectedDate } = useCalendar();
  const dateString = formatDateForApi(selectedDate);
  const { data: day, isLoading } = useDayByDate(dateString);
  const createDay = useCreateDay();
  const updateDay = useUpdateDay();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createdDayId, setCreatedDayId] = useState<string | null>(null);

  // Use the fetched day's id, or fall back to the newly created day's id
  const dayId = day?.id ?? createdDayId;

  // Deduplicated day creation — shared by time blocks and todos
  const pendingDayPromise = useRef<Promise<string> | null>(null);
  const latestRefs = useRef({ day, createdDayId, dateString, createDay });

  useEffect(() => {
    latestRefs.current = { day, createdDayId, dateString, createDay };
  });

  useEffect(() => {
    // Reset pending promise when date changes
    pendingDayPromise.current = null;
  }, [dateString]);

  const ensureDayId = useCallback(async (): Promise<string> => {
    const { day, createdDayId, dateString, createDay } = latestRefs.current;
    const existing = day?.id ?? createdDayId;
    if (existing) return existing;

    if (!pendingDayPromise.current) {
      pendingDayPromise.current = createDay
        .mutateAsync({ date: dateString })
        .then((newDay) => {
          setCreatedDayId(newDay.id);
          return newDay.id;
        });
    }

    return pendingDayPromise.current;
  }, []);

  const handleAddTimeBlock = () => {
    // Start creating the day eagerly — submit will await the same promise
    ensureDayId();
    setIsModalOpen(true);
  };

  const handleToggleComplete = async () => {
    if (day) {
      await updateDay.mutateAsync({
        id: day.id,
        data: { isCompleted: !day.isCompleted },
      });
    }
  };

  if (isLoading) {
    return <DayViewSkeleton />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold sm:text-2xl">
            {format(selectedDate, 'EEEE')}
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            {format(selectedDate, 'MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex gap-2">
          {day && (
            <Button
              variant={day.isCompleted ? 'default' : 'outline'}
              onClick={handleToggleComplete}
              disabled={updateDay.isPending}
              size="sm"
              className={cn(
                'h-10 sm:h-9',
                day.isCompleted && 'bg-green-600 hover:bg-green-700'
              )}
            >
              <Check className="mr-1.5 h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">
                {day.isCompleted ? 'Completed' : 'Mark Complete'}
              </span>
              <span className="sm:hidden">
                {day.isCompleted ? 'Done' : 'Complete'}
              </span>
            </Button>
          )}
          <Button
            onClick={handleAddTimeBlock}
            disabled={createDay.isPending}
            size="sm"
            className="h-10 sm:h-9"
          >
            <Plus className="mr-1.5 h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Add Time Block</span>
            <span className="sm:hidden">Add Block</span>
          </Button>
        </div>
      </div>

      <EventsSection date={selectedDate} />

      <DayTodoSection dayId={dayId ?? undefined} ensureDayId={ensureDayId} />

      {day ? (
        <TimeBlockList day={day} />
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            No time blocks for this day. Add one to get started!
          </p>
        </div>
      )}

      <TimeBlockModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        dayId={dayId}
        ensureDayId={ensureDayId}
      />
    </div>
  );
}

function DayViewSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-6 w-28 sm:h-8 sm:w-32" />
          <Skeleton className="mt-1 h-4 w-36 sm:h-5 sm:w-48" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24 sm:h-9 sm:w-32" />
          <Skeleton className="h-10 w-28 sm:h-9 sm:w-36" />
        </div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full sm:h-24" />
        ))}
      </div>
    </div>
  );
}
