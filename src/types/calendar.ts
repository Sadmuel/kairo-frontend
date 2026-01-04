export interface Day {
  id: string;
  date: string;
  isCompleted: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  timeBlocks: TimeBlock[];
}

export interface TimeBlock {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  isCompleted: boolean;
  order: number;
  color: string | null;
  dayId: string;
  createdAt: string;
  updatedAt: string;
  notes: Note[];
}

export interface Note {
  id: string;
  content: string;
  order: number;
  timeBlockId: string;
  createdAt: string;
  updatedAt: string;
}

// DTOs
export interface CreateDayDto {
  date: string;
}

export interface UpdateDayDto {
  isCompleted?: boolean;
}

export interface CreateTimeBlockDto {
  name: string;
  startTime: string;
  endTime: string;
  color?: string;
  dayId: string;
  order?: number;
}

export interface UpdateTimeBlockDto {
  name?: string;
  startTime?: string;
  endTime?: string;
  color?: string;
  isCompleted?: boolean;
}

export interface ReorderTimeBlocksDto {
  orderedIds: string[];
}

export interface CreateNoteDto {
  content: string;
  timeBlockId: string;
  order?: number;
}

export interface UpdateNoteDto {
  content?: string;
}

export interface ReorderNotesDto {
  orderedIds: string[];
}

// Calendar state
export type CalendarView = 'month' | 'week' | 'day';

export interface CalendarState {
  selectedDate: Date;
  currentView: CalendarView;
}

// Color palette for time blocks
export const BLOCK_COLORS = [
  { name: 'Blue', value: '#A5D8FF' },
  { name: 'Green', value: '#B2F2BB' },
  { name: 'Yellow', value: '#FFEC99' },
  { name: 'Pink', value: '#FCC2D7' },
  { name: 'Purple', value: '#D0BFFF' },
] as const;

export const DEFAULT_BLOCK_COLOR = '#A5D8FF';
