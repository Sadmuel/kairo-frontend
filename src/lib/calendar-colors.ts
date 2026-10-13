import type { CSSProperties } from 'react';
import { DEFAULT_BLOCK_COLOR } from '@/types/calendar';

const CALENDAR_BACKGROUND_TINT = 11;
export const CALENDAR_DAY_ACCENT_WIDTH = 6;
export const CALENDAR_COMPACT_ACCENT_WIDTH = 3;

export function getCalendarColorStyle(
  color: string | null,
  accentWidth: number,
): CSSProperties {
  const resolvedColor = color || DEFAULT_BLOCK_COLOR;

  return {
    borderLeftWidth: accentWidth,
    borderLeftColor: resolvedColor,
    backgroundColor: `color-mix(in srgb, ${resolvedColor} ${CALENDAR_BACKGROUND_TINT}%, hsl(var(--card)))`,
  };
}
