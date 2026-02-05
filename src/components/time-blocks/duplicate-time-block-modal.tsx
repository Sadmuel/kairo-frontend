'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useDuplicateTimeBlock } from '@/hooks/use-time-blocks';
import { useEnsureDay } from '@/hooks/use-days';
import type { TimeBlock } from '@/types/calendar';

interface DuplicateTimeBlockModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timeBlock: TimeBlock;
}

export function DuplicateTimeBlockModal({
  open,
  onOpenChange,
  timeBlock,
}: DuplicateTimeBlockModalProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [includeNotes, setIncludeNotes] = useState(true);
  const [includeTodos, setIncludeTodos] = useState(false);

  const duplicateTimeBlock = useDuplicateTimeBlock();
  const ensureDay = useEnsureDay();

  const isPending = duplicateTimeBlock.isPending || ensureDay.isPending;

  const handleDuplicate = async () => {
    if (!selectedDate) return;

    try {
      // Ensure target day exists
      const targetDay = await ensureDay.mutateAsync(selectedDate);

      // Duplicate the time block
      await duplicateTimeBlock.mutateAsync({
        id: timeBlock.id,
        data: {
          targetDayId: targetDay.id,
          includeNotes,
          includeTodos,
        },
      });

      // Format date for display
      const [year, month, day] = selectedDate.split('-').map(Number);
      const displayDate = format(new Date(year, month - 1, day), 'MMM d');

      toast.success(`Time block duplicated to ${displayDate}`);
      onOpenChange(false);
      // Reset form
      setSelectedDate('');
      setIncludeNotes(true);
      setIncludeTodos(false);
    } catch {
      toast.error('Failed to duplicate time block');
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      // Reset form when closing
      setSelectedDate('');
      setIncludeNotes(true);
      setIncludeTodos(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Duplicate "{timeBlock.name}"</DialogTitle>
          <DialogDescription>
            Choose a date and options for the duplicate time block.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="target-date">Target date</Label>
            <Input
              id="target-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeNotes"
                checked={includeNotes}
                onCheckedChange={(checked) => setIncludeNotes(checked === true)}
              />
              <Label htmlFor="includeNotes" className="text-sm font-normal cursor-pointer">
                Include notes
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeTodos"
                checked={includeTodos}
                onCheckedChange={(checked) => setIncludeTodos(checked === true)}
              />
              <Label htmlFor="includeTodos" className="text-sm font-normal cursor-pointer">
                Include todos (will be marked incomplete)
              </Label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleDuplicate}
            disabled={!selectedDate || isPending}
          >
            {isPending ? 'Duplicating...' : 'Duplicate'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
