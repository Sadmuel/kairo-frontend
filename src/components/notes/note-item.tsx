import { useState } from 'react';
import { GripVertical, Pencil, Trash2, Check, X } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUpdateNote, useDeleteNote } from '@/hooks/use-notes';
import type { Note } from '@/types/calendar';
import { cn } from '@/lib/utils';

interface NoteItemProps {
  note: Note;
}

export function NoteItem({ note }: NoteItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(note.content);
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: note.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = async () => {
    if (!editContent.trim()) {
      return;
    }
    await updateNote.mutateAsync({
      id: note.id,
      data: { content: editContent },
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(note.content);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await deleteNote.mutateAsync(note.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex items-center gap-1 rounded-md py-1 px-1 -mx-1 hover:bg-muted/50 sm:gap-2 sm:px-2 sm:-mx-2',
        isDragging && 'opacity-50'
      )}
    >
      {/* Drag handle - always visible on mobile for discoverability */}
      <button
        {...attributes}
        {...listeners}
        className="flex h-8 w-8 cursor-grab items-center justify-center touch-none text-muted-foreground opacity-100 sm:h-6 sm:w-6 sm:opacity-0 sm:group-hover:opacity-100"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {isEditing ? (
        <div className="flex flex-1 items-center gap-1">
          <Input
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
            autoFocus
            disabled={updateNote.isPending}
            className="h-10 text-sm sm:h-9"
          />
          <Button
            size="icon"
            variant="ghost"
            className="h-10 w-10 sm:h-9 sm:w-9"
            onClick={handleSave}
            disabled={updateNote.isPending}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-10 w-10 sm:h-9 sm:w-9"
            onClick={handleCancel}
            disabled={updateNote.isPending}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          <span className="flex-1 text-sm py-1">{note.content}</span>
          {/* Action buttons - always visible on mobile, hover on desktop */}
          <div className="flex items-center gap-0 opacity-100 sm:gap-1 sm:opacity-0 sm:group-hover:opacity-100">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 sm:h-7 sm:w-7"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-3.5 w-3.5 sm:h-3 sm:w-3" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-destructive hover:text-destructive sm:h-7 sm:w-7"
              onClick={handleDelete}
              disabled={deleteNote.isPending}
            >
              <Trash2 className="h-3.5 w-3.5 sm:h-3 sm:w-3" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
