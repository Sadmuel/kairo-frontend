import { format } from 'date-fns';
import { Plus, Check } from 'lucide-react';
import { useCalendar } from '@/hooks/use-calendar';
import { useDayByDate, useCreateDay, useUpdateDay } from '@/hooks/use-days';
import { formatDateForApi } from '@/lib/date-utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TimeBlockList } from '@/components/time-blocks/time-block-list';
import { TimeBlockModal } from '@/components/time-blocks/time-block-modal';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function DayView() {
  const { selectedDate } = useCalendar();
  const dateString = formatDateForApi(selectedDate);
  const { data: day, isLoading } = useDayByDate(dateString);
  const createDay = useCreateDay();
  const updateDay = useUpdateDay();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTimeBlock = async () => {
    // If no day exists, create it first
    if (!day) {
      await createDay.mutateAsync({ date: dateString });
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {format(selectedDate, 'EEEE')}
          </h2>
          <p className="text-muted-foreground">
            {format(selectedDate, 'MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex gap-2">
          {day && (
            <Button
              variant={day.isCompleted ? 'default' : 'outline'}
              onClick={handleToggleComplete}
              disabled={updateDay.isPending}
              className={cn(
                day.isCompleted && 'bg-green-600 hover:bg-green-700'
              )}
            >
              <Check className="mr-2 h-4 w-4" />
              {day.isCompleted ? 'Completed' : 'Mark Complete'}
            </Button>
          )}
          <Button onClick={handleAddTimeBlock} disabled={createDay.isPending}>
            <Plus className="mr-2 h-4 w-4" />
            Add Time Block
          </Button>
        </div>
      </div>

      {day ? (
        <TimeBlockList day={day} />
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            No time blocks for this day. Add one to get started!
          </p>
        </div>
      )}

      {day && (
        <TimeBlockModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          dayId={day.id}
        />
      )}
    </div>
  );
}

function DayViewSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="mt-1 h-5 w-48" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    </div>
  );
}
