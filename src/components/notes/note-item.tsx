'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { GripVertical, Pencil, Trash2, Check, X } from 'lucide-react';
import { useSortable, CSS } from '@/lib/dnd-kit';
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
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
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
    setSaveError(null);
    try {
      await updateNote.mutateAsync({
        id: note.id,
        data: { content: editContent },
      });
      setIsEditing(false);
      toast.success('Note updated');
    } catch {
      setSaveError('Failed to save note. Please try again.');
      // Using inline error only - user is looking at the edit form
    }
  };

  const handleCancel = () => {
    setEditContent(note.content);
    setSaveError(null);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setDeleteError(null);
    try {
      await deleteNote.mutateAsync(note.id);
      toast.success('Note deleted');
    } catch {
      setDeleteError('Failed to delete note. Please try again.');
      // Using inline error only - user is looking at this component
    }
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
        type="button"
        aria-label="Drag to reorder note"
        {...attributes}
        {...listeners}
        className="flex h-8 w-8 cursor-grab items-center justify-center touch-none text-muted-foreground opacity-100 sm:h-6 sm:w-6 sm:opacity-0 sm:group-hover:opacity-100"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {isEditing ? (
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-1">
            <Input
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
              autoFocus
              disabled={updateNote.isPending}
              className={cn('h-10 text-sm sm:h-9', saveError && 'border-destructive')}
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
          {saveError && (
            <p className="text-xs text-destructive">{saveError}</p>
          )}
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center">
            <span className="flex-1 text-sm py-1">{note.content}</span>
            {/* Action buttons - always visible on mobile, hover on desktop */}
            <div className="flex items-center gap-0 opacity-100 sm:gap-1 sm:opacity-0 sm:group-hover:opacity-100">
              <Button
                size="icon"
                variant="ghost"
                aria-label="Edit note"
                className="h-10 w-10 sm:h-7 sm:w-7"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-3.5 w-3.5 sm:h-3 sm:w-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Delete note"
                aria-disabled={deleteNote.isPending}
                className="h-10 w-10 text-destructive hover:text-destructive sm:h-7 sm:w-7"
                onClick={handleDelete}
                disabled={deleteNote.isPending}
              >
                <Trash2 className="h-3.5 w-3.5 sm:h-3 sm:w-3" />
              </Button>
            </div>
          </div>
          {deleteError && (
            <p className="text-xs text-destructive">{deleteError}</p>
          )}
        </div>
      )}
    </div>
  );
}
