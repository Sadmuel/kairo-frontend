'use client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { ReactNode } from 'react';

interface SortableListProps {
  items: string[];
  onDragEnd: (event: DragEndEvent) => void;
  children: ReactNode;
}

export function SortableList({ items, onDragEnd, children }: SortableListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}

// Re-export hooks and utilities for convenience
export { useSortable } from '@dnd-kit/sortable';
export { CSS } from '@dnd-kit/utilities';
export { arrayMove } from '@dnd-kit/sortable';
export type { DragEndEvent };
