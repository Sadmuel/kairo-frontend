import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface RecurringDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timeBlockName: string;
  onDeleteOccurrence: () => void;
  onStopRecurring: () => void;
  isDeleting?: boolean;
  isDeactivating?: boolean;
  error?: string | null;
}

export function RecurringDeleteDialog({
  open,
  onOpenChange,
  timeBlockName,
  onDeleteOccurrence,
  onStopRecurring,
  isDeleting = false,
  isDeactivating = false,
  error = null,
}: RecurringDeleteDialogProps) {
  const isLoading = isDeleting || isDeactivating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Recurring Time Block</DialogTitle>
          <DialogDescription>
            &ldquo;{timeBlockName}&rdquo; is a recurring time block. What would you like to do?
          </DialogDescription>
          {error && (
            <p className="text-sm text-destructive mt-2">{error}</p>
          )}
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            variant="outline"
            onClick={onDeleteOccurrence}
            disabled={isLoading}
            className="w-full"
          >
            {isDeleting ? 'Deleting...' : 'Delete this occurrence'}
          </Button>
          <Button
            variant="destructive"
            onClick={onStopRecurring}
            disabled={isLoading}
            className="w-full"
          >
            {isDeactivating ? 'Stopping...' : 'Stop repeating'}
          </Button>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="w-full"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
