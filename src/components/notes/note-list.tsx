'use client';

import { useState } from 'react';
import { SortableList } from '@/components/ui/sortable-context';
import { arrayMove, type DragEndEvent } from '@/lib/dnd-kit';
import { NoteItem } from './note-item';
import { NoteForm } from './note-form';
import { useReorderNotes } from '@/hooks/use-notes';
import type { Note } from '@/types/calendar';

interface NoteListProps {
  timeBlockId: string;
  notes: Note[];
}

export function NoteList({ timeBlockId, notes }: NoteListProps) {
  const reorderNotes = useReorderNotes();
  const [reorderError, setReorderError] = useState<string | null>(null);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = notes.findIndex((n) => n.id === active.id);
      const newIndex = notes.findIndex((n) => n.id === over.id);

      if (oldIndex === -1 || newIndex === -1) {
        console.warn('Drag reorder failed: note not found in list');
        return;
      }

      const newOrder = arrayMove(notes, oldIndex, newIndex);
      const orderedIds = newOrder.map((n) => n.id);

      setReorderError(null);
      try {
        await reorderNotes.mutateAsync({
          timeBlockId,
          data: { orderedIds },
        });
      } catch (error) {
        console.error('Failed to reorder notes:', error);
        setReorderError('Failed to reorder. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-2">
      {reorderError && (
        <p className="text-xs text-destructive">{reorderError}</p>
      )}
      {notes.length > 0 && (
        <SortableList
          items={notes.map((n) => n.id)}
          onDragEnd={handleDragEnd}
        >
          <div className="space-y-1">
            {notes.map((note) => (
              <NoteItem key={note.id} note={note} />
            ))}
          </div>
        </SortableList>
      )}

      <NoteForm timeBlockId={timeBlockId} />
    </div>
  );
}
