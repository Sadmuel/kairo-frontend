import { useRef } from 'react';
import { BLOCK_COLORS } from '@/types/calendar';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  disabled?: boolean;
}

export function ColorPicker({ value, onChange, disabled }: ColorPickerProps) {
  const colorInputRef = useRef<HTMLInputElement>(null);
  const isPresetColor = BLOCK_COLORS.some(
    (c) => c.value.toLowerCase() === value.toLowerCase(),
  );

  return (
    <div className="flex flex-wrap gap-2">
      {BLOCK_COLORS.map((c) => (
        <button
          key={c.value}
          type="button"
          onClick={() => onChange(c.value)}
          className={cn(
            'h-10 w-10 rounded-full transition-all sm:h-8 sm:w-8',
            c.value.toLowerCase() === value.toLowerCase() &&
              'ring-2 ring-offset-2 ring-primary',
          )}
          style={{ backgroundColor: c.value }}
          title={c.name}
          aria-label={c.name}
          disabled={disabled}
        />
      ))}

      {/* Custom color button */}
      <button
        type="button"
        onClick={() => colorInputRef.current?.click()}
        className={cn(
          'h-10 w-10 rounded-full transition-all sm:h-8 sm:w-8',
          'border-2 border-dashed border-muted-foreground/40',
          'flex items-center justify-center',
          !isPresetColor && 'ring-2 ring-offset-2 ring-primary border-solid',
        )}
        style={{
          background: isPresetColor
            ? 'conic-gradient(#FFC9C9, #FFEC99, #B2F2BB, #99E9F2, #A5D8FF, #D0BFFF, #FCC2D7, #FFC9C9)'
            : value,
        }}
        title="Custom color"
        aria-label="Choose custom color"
        disabled={disabled}
      >
        {isPresetColor && (
          <span className="text-xs font-bold text-white drop-shadow-sm">+</span>
        )}
      </button>

      <input
        ref={colorInputRef}
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
        tabIndex={-1}
        disabled={disabled}
      />
    </div>
  );
}
