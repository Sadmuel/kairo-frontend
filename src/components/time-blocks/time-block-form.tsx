import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TimePicker } from './time-picker';
import { DEFAULT_BLOCK_COLOR } from '@/types/calendar';
import type { TimeBlock, CreateTimeBlockDto, UpdateTimeBlockDto } from '@/types/calendar';
import { ColorPicker } from '@/components/ui/color-picker';

interface TimeBlockFormCreateProps {
  mode: 'create';
  dayId: string;
  onSubmit: (data: CreateTimeBlockDto) => Promise<void>;
  onCancel: () => void;
  isPending?: boolean;
}

interface TimeBlockFormEditProps {
  mode: 'edit';
  dayId: string;
  timeBlock: TimeBlock;
  onSubmit: (data: UpdateTimeBlockDto) => Promise<void>;
  onCancel: () => void;
  isPending?: boolean;
}

type TimeBlockFormProps = TimeBlockFormCreateProps | TimeBlockFormEditProps;

export function TimeBlockForm(props: TimeBlockFormProps) {
  const { dayId, onSubmit, onCancel, isPending } = props;
  const isEdit = props.mode === 'edit';
  const timeBlock = isEdit ? props.timeBlock : undefined;

  const [name, setName] = useState(timeBlock?.name || '');
  const [startTime, setStartTime] = useState(timeBlock?.startTime || '09:00');
  const [endTime, setEndTime] = useState(timeBlock?.endTime || '10:00');
  const [color, setColor] = useState(timeBlock?.color || DEFAULT_BLOCK_COLOR);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (startTime >= endTime) {
      setError('End time must be after start time');
      return;
    }

    if (isEdit) {
      await (onSubmit as (data: UpdateTimeBlockDto) => Promise<void>)({
        name,
        startTime,
        endTime,
        color,
      });
    } else {
      await (onSubmit as (data: CreateTimeBlockDto) => Promise<void>)({
        name,
        startTime,
        endTime,
        color,
        dayId,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Morning Routine"
          disabled={isPending}
          className="h-10 sm:h-9"
        />
      </div>

      {/* Time pickers - stack on mobile, side by side on desktop */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        <div className="space-y-2">
          <Label>Start Time</Label>
          <TimePicker
            value={startTime}
            onChange={setStartTime}
            disabled={isPending}
          />
        </div>
        <div className="space-y-2">
          <Label>End Time</Label>
          <TimePicker
            value={endTime}
            onChange={setEndTime}
            disabled={isPending}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Color</Label>
        <ColorPicker value={color} onChange={setColor} disabled={isPending} />
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {/* Action buttons - full width on mobile */}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
          className="h-10 sm:h-9"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} className="h-10 sm:h-9">
          {isPending ? 'Saving...' : isEdit ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}
