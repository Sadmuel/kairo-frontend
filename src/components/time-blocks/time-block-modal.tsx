import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TimeBlockForm } from './time-block-form';
import { useCreateTimeBlock, useUpdateTimeBlock } from '@/hooks/use-time-blocks';
import type { TimeBlock, CreateTimeBlockDto, UpdateTimeBlockDto } from '@/types/calendar';

interface TimeBlockModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dayId: string;
  timeBlock?: TimeBlock;
}

export function TimeBlockModal({
  open,
  onOpenChange,
  dayId,
  timeBlock,
}: TimeBlockModalProps) {
  const createTimeBlock = useCreateTimeBlock();
  const updateTimeBlock = useUpdateTimeBlock();
  const isEdit = !!timeBlock;

  const handleCreate = async (data: CreateTimeBlockDto) => {
    await createTimeBlock.mutateAsync(data);
    onOpenChange(false);
  };

  const handleUpdate = async (data: UpdateTimeBlockDto) => {
    if (!timeBlock) return;
    await updateTimeBlock.mutateAsync({
      id: timeBlock.id,
      data,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Time Block' : 'Create Time Block'}
          </DialogTitle>
        </DialogHeader>
        {isEdit && timeBlock ? (
          <TimeBlockForm
            mode="edit"
            dayId={dayId}
            timeBlock={timeBlock}
            onSubmit={handleUpdate}
            onCancel={() => onOpenChange(false)}
            isPending={updateTimeBlock.isPending}
          />
        ) : (
          <TimeBlockForm
            mode="create"
            dayId={dayId}
            onSubmit={handleCreate}
            onCancel={() => onOpenChange(false)}
            isPending={createTimeBlock.isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
