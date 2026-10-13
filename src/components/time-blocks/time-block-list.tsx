'use client';

import { TimeBlockCard } from './time-block-card';
import type { Day } from '@/types/calendar';

interface TimeBlockListProps {
  day: Day;
}

export function TimeBlockList({ day }: TimeBlockListProps) {
  if (day.timeBlocks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">
          No time blocks yet. Add one to get started!
        </p>
      </div>
    );
  }

  const sortedBlocks = [...day.timeBlocks].sort(
    (a, b) => a.startTime.localeCompare(b.startTime) || a.order - b.order
  );

  return (
    <div className="space-y-3">
      {sortedBlocks.map((timeBlock) => (
        <TimeBlockCard
          key={timeBlock.id}
          timeBlock={timeBlock}
          dayId={day.id}
        />
      ))}
    </div>
  );
}
