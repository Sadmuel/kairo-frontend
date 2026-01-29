import { StickyNote } from 'lucide-react';
import { CollapsibleSection } from '@/components/ui/collapsible-section';
import { NoteList } from './note-list';
import type { Note } from '@/types/calendar';

interface NoteSectionProps {
  timeBlockId: string;
  notes: Note[];
}

export function NoteSection({ timeBlockId, notes }: NoteSectionProps) {
  return (
    <CollapsibleSection
      icon={StickyNote}
      label="Notes"
      badge={notes.length > 0 ? `${notes.length}` : undefined}
      contentId={`notes-${timeBlockId}`}
    >
      <NoteList timeBlockId={timeBlockId} notes={notes} />
    </CollapsibleSection>
  );
}
