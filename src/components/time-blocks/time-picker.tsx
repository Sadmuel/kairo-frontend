import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

// Generate time options from 00:00 to 23:30 in 30-minute intervals
const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hours = Math.floor(i / 2);
  const minutes = (i % 2) * 30;
  const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  const hour12 = hours % 12 || 12;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const label = `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  return { value: time, label };
});

export function TimePicker({ value, onChange, disabled }: TimePickerProps) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full h-10 sm:h-9 sm:w-[120px]">
        <SelectValue placeholder="Select time" />
      </SelectTrigger>
      <SelectContent className="max-h-[280px] sm:max-h-[200px]">
        {TIME_OPTIONS.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="h-10 sm:h-8"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
