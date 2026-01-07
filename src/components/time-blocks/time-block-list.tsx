'use client';

import { useState } from 'react';
import { SortableList } from '@/components/ui/sortable-context';
import { arrayMove, type DragEndEvent } from '@/lib/dnd-kit';
import { TimeBlockCard } from './time-block-card';
import { useReorderTimeBlocks } from '@/hooks/use-time-blocks';
import type { Day } from '@/types/calendar';

interface TimeBlockListProps {
  day: Day;
}

export function TimeBlockList({ day }: TimeBlockListProps) {
  const reorderTimeBlocks = useReorderTimeBlocks();
  const [reorderError, setReorderError] = useState<string | null>(null);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = day.timeBlocks.findIndex((b) => b.id === active.id);
      const newIndex = day.timeBlocks.findIndex((b) => b.id === over.id);

      if (oldIndex === -1 || newIndex === -1) {
        console.warn('Drag reorder failed: time block not found in list');
        return;
      }

      const newOrder = arrayMove(day.timeBlocks, oldIndex, newIndex);
      const orderedIds = newOrder.map((b) => b.id);

      setReorderError(null);
      try {
        await reorderTimeBlocks.mutateAsync({
          dayId: day.id,
          data: { orderedIds },
        });
      } catch {
        setReorderError('Failed to reorder. The list has been restored.');
      }
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
    <div className="space-y-3">
      {reorderError && (
        <p className="text-sm text-destructive">{reorderError}</p>
      )}
      <SortableList
        items={day.timeBlocks.map((b) => b.id)}
        onDragEnd={handleDragEnd}
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
      </SortableList>
    </div>
  );
}
