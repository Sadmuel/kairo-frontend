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

  const handleSubmit = async (data: CreateTimeBlockDto | UpdateTimeBlockDto) => {
    if (isEdit) {
      await updateTimeBlock.mutateAsync({
        id: timeBlock.id,
        data: data as UpdateTimeBlockDto,
      });
    } else {
      await createTimeBlock.mutateAsync(data as CreateTimeBlockDto);
    }
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
        <TimeBlockForm
          dayId={dayId}
          timeBlock={timeBlock}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isPending={createTimeBlock.isPending || updateTimeBlock.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
