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
import { TimeBlockCard } from './time-block-card';
import { useReorderTimeBlocks } from '@/hooks/use-time-blocks';
import type { Day } from '@/types/calendar';

interface TimeBlockListProps {
  day: Day;
}

export function TimeBlockList({ day }: TimeBlockListProps) {
  const reorderTimeBlocks = useReorderTimeBlocks();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = day.timeBlocks.findIndex((b) => b.id === active.id);
      const newIndex = day.timeBlocks.findIndex((b) => b.id === over.id);

      const newOrder = arrayMove(day.timeBlocks, oldIndex, newIndex);
      const orderedIds = newOrder.map((b) => b.id);

      await reorderTimeBlocks.mutateAsync({
        dayId: day.id,
        data: { orderedIds },
      });
    }
  };

  if (day.timeBlocks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">
          No time blocks yet. Add one to get started!
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={day.timeBlocks.map((b) => b.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {day.timeBlocks.map((timeBlock) => (
            <TimeBlockCard
              key={timeBlock.id}
              timeBlock={timeBlock}
              dayId={day.id}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
