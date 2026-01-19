import { useState, FormEvent } from 'react';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateNote } from '@/hooks/use-notes';

interface NoteFormProps {
  timeBlockId: string;
}

export function NoteForm({ timeBlockId }: NoteFormProps) {
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const createNote = useCreateNote();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await createNote.mutateAsync({
        content: content.trim(),
        timeBlockId,
      });

      setContent('');
      setIsExpanded(false);
      toast.success('Note created');
    } catch {
      toast.error('Failed to create note');
    }
  };

  if (!isExpanded) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-muted-foreground"
        onClick={() => setIsExpanded(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add note
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a note..."
        autoFocus
        disabled={createNote.isPending}
        onBlur={() => {
          if (!content.trim()) setIsExpanded(false);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setContent('');
            setIsExpanded(false);
          }
        }}
        className="h-8 text-sm"
      />
      <Button
        type="submit"
        size="sm"
        disabled={createNote.isPending || !content.trim()}
      >
        Add
      </Button>
    </form>
  );
}
