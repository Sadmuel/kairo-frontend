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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = notes.findIndex((n) => n.id === active.id);
      const newIndex = notes.findIndex((n) => n.id === over.id);

      const newOrder = arrayMove(notes, oldIndex, newIndex);
      const orderedIds = newOrder.map((n) => n.id);

      await reorderNotes.mutateAsync({
        timeBlockId,
        data: { orderedIds },
      });
    }
  };

  return (
    <div className="space-y-2">
      {notes.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={notes.map((n) => n.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-1">
              {notes.map((note) => (
                <NoteItem key={note.id} note={note} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <NoteForm timeBlockId={timeBlockId} />
    </div>
  );
}
