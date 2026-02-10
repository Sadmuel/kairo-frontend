import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const DAYS = [
  { value: '1', label: 'M' },
  { value: '2', label: 'T' },
  { value: '3', label: 'W' },
  { value: '4', label: 'T' },
  { value: '5', label: 'F' },
  { value: '6', label: 'S' },
  { value: '7', label: 'S' },
] as const;

interface DayOfWeekPickerProps {
  value: number[];
  onChange: (days: number[]) => void;
  disabled?: boolean;
}

export function DayOfWeekPicker({ value, onChange, disabled }: DayOfWeekPickerProps) {
  const stringValue = value.map(String);

  return (
    <ToggleGroup
      type="multiple"
      value={stringValue}
      onValueChange={(vals) => onChange(vals.map(Number))}
      className="justify-start gap-1.5"
    >
      {DAYS.map((day) => (
        <ToggleGroupItem
          key={day.value}
          value={day.value}
          disabled={disabled}
          className="h-8 w-8 rounded-full text-xs font-medium data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          aria-label={`Day ${day.value}`}
        >
          {day.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
