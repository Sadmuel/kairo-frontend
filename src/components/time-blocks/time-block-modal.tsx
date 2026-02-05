import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TimeBlockForm } from './time-block-form';
import { useCreateTimeBlock, useUpdateTimeBlock } from '@/hooks/use-time-blocks';
import { useCreateTemplate } from '@/hooks/use-time-block-templates';
import type { TimeBlock, CreateTimeBlockDto, UpdateTimeBlockDto, CreateTimeBlockTemplateDto } from '@/types/calendar';

interface TimeBlockModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dayId?: string | null;
  ensureDayId?: () => Promise<string>;
  timeBlock?: TimeBlock;
}

export function TimeBlockModal({
  open,
  onOpenChange,
  dayId,
  ensureDayId,
  timeBlock,
}: TimeBlockModalProps) {
  const createTimeBlock = useCreateTimeBlock();
  const updateTimeBlock = useUpdateTimeBlock();
  const createTemplate = useCreateTemplate();
  const isEdit = !!timeBlock;

  const handleCreate = async (data: CreateTimeBlockDto) => {
    try {
      let resolvedDayId = dayId;
      if (!resolvedDayId && ensureDayId) {
        resolvedDayId = await ensureDayId();
      }
      if (!resolvedDayId) {
        toast.error('Failed to create time block');
        return;
      }
      await createTimeBlock.mutateAsync({ ...data, dayId: resolvedDayId });
      onOpenChange(false);
      toast.success('Time block created');
    } catch {
      toast.error('Failed to create time block');
    }
  };

  const handleCreateTemplate = async (data: CreateTimeBlockTemplateDto) => {
    try {
      await createTemplate.mutateAsync(data);
      onOpenChange(false);
      toast.success('Recurring time block created');
    } catch {
      toast.error('Failed to create recurring time block');
    }
  };

  const handleUpdate = async (data: UpdateTimeBlockDto) => {
    if (!timeBlock) return;
    try {
      await updateTimeBlock.mutateAsync({
        id: timeBlock.id,
        data,
      });
      onOpenChange(false);
      toast.success('Time block updated');
    } catch {
      toast.error('Failed to update time block');
    }
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
            dayId={dayId ?? ''}
            timeBlock={timeBlock}
            onSubmit={handleUpdate}
            onCancel={() => onOpenChange(false)}
            isPending={updateTimeBlock.isPending}
          />
        ) : (
          <TimeBlockForm
            mode="create"
            dayId={dayId ?? ''}
            onSubmit={handleCreate}
            onSubmitTemplate={handleCreateTemplate}
            onCancel={() => onOpenChange(false)}
            isPending={createTimeBlock.isPending || createTemplate.isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
