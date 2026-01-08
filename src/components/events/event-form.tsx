import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BLOCK_COLORS,
  DEFAULT_BLOCK_COLOR,
  type Event,
  type CreateEventDto,
  type UpdateEventDto,
  type RecurrenceType,
} from '@/types/calendar';
import { cn } from '@/lib/utils';
import { formatDateForApi } from '@/lib/date-utils';

interface EventFormCreateProps {
  mode: 'create';
  initialDate?: string;
  onSubmit: (data: CreateEventDto) => Promise<void>;
  onCancel: () => void;
  isPending?: boolean;
}

interface EventFormEditProps {
  mode: 'edit';
  event: Event;
  onSubmit: (data: UpdateEventDto) => Promise<void>;
  onCancel: () => void;
  isPending?: boolean;
}

type EventFormProps = EventFormCreateProps | EventFormEditProps;

const RECURRENCE_OPTIONS: { value: RecurrenceType; label: string }[] = [
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKDAYS', label: 'Weekdays (Mon-Fri)' },
  { value: 'WEEKENDS', label: 'Weekends (Sat-Sun)' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'YEARLY', label: 'Yearly' },
];

export function EventForm(props: EventFormProps) {
  const { onSubmit, onCancel, isPending } = props;
  const isEdit = props.mode === 'edit';
  const event = isEdit ? props.event : undefined;
  const initialDate = !isEdit ? props.initialDate : undefined;

  const [title, setTitle] = useState(event?.title || '');
  const [date, setDate] = useState(
    event?.date || initialDate || formatDateForApi(new Date())
  );
  const [color, setColor] = useState(event?.color || DEFAULT_BLOCK_COLOR);
  const [isRecurring, setIsRecurring] = useState(event?.isRecurring || false);
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>(
    event?.recurrenceType || 'NONE'
  );
  const [error, setError] = useState<string | null>(null);

  const handleRecurringChange = (checked: boolean) => {
    setIsRecurring(checked);
    if (!checked) {
      setRecurrenceType('NONE');
    } else if (recurrenceType === 'NONE') {
      setRecurrenceType('WEEKLY');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!date) {
      setError('Date is required');
      return;
    }

    if (isRecurring && recurrenceType === 'NONE') {
      setError('Please select a recurrence pattern');
      return;
    }

    const finalRecurrenceType = isRecurring ? recurrenceType : 'NONE';

    try {
      if (isEdit) {
        await (onSubmit as (data: UpdateEventDto) => Promise<void>)({
          title,
          date,
          color,
          isRecurring,
          recurrenceType: finalRecurrenceType,
        });
      } else {
        await (onSubmit as (data: CreateEventDto) => Promise<void>)({
          title,
          date,
          color,
          isRecurring,
          recurrenceType: finalRecurrenceType,
        });
      }
    } catch {
      setError('Failed to save event. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Mom's Birthday"
          disabled={isPending}
          className="h-10 sm:h-9"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          disabled={isPending}
          className="h-10 sm:h-9"
        />
      </div>

      <div className="space-y-2">
        <Label>Color</Label>
        <div className="flex flex-wrap gap-2 sm:gap-2">
          {BLOCK_COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setColor(c.value)}
              className={cn(
                'h-10 w-10 rounded-full transition-all sm:h-8 sm:w-8',
                color === c.value && 'ring-2 ring-offset-2 ring-primary'
              )}
              style={{ backgroundColor: c.value }}
              title={c.name}
              aria-label={c.name}
              disabled={isPending}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isRecurring"
            checked={isRecurring}
            onCheckedChange={handleRecurringChange}
            disabled={isPending}
          />
          <Label htmlFor="isRecurring" className="cursor-pointer">
            Repeats
          </Label>
        </div>

        {isRecurring && (
          <div className="space-y-2">
            <Label htmlFor="recurrenceType">Repeat frequency</Label>
            <Select
              value={recurrenceType}
              onValueChange={(value) =>
                setRecurrenceType(value as RecurrenceType)
              }
              disabled={isPending}
            >
              <SelectTrigger id="recurrenceType" className="h-10 sm:h-9">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {RECURRENCE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

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
