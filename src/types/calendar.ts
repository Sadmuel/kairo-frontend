export interface Day {
  id: string;
  date: string;
  isCompleted: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  timeBlocks: TimeBlock[];
  todos?: Todo[];
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
  templateId: string | null;
  createdAt: string;
  updatedAt: string;
  notes: Note[];
  todos?: Todo[];
}

export interface Note {
  id: string;
  content: string;
  order: number;
  timeBlockId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Todo {
  id: string;
  title: string;
  isCompleted: boolean;
  deadline: string | null;
  order: number;
  userId: string;
  dayId: string | null;
  timeBlockId: string | null;
  createdAt: string;
  updatedAt: string;
  day?: Day | null;
  timeBlock?: TimeBlock | null;
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

export interface CreateTodoDto {
  title: string;
  deadline?: string;
  dayId?: string;
  timeBlockId?: string;
  order?: number;
}

export interface UpdateTodoDto {
  title?: string;
  isCompleted?: boolean;
  deadline?: string | null;
}

export interface MoveTodoDto {
  targetDayId?: string;
  targetTimeBlockId?: string;
}

export interface DuplicateTimeBlockDto {
  targetDayId: string;
  includeNotes?: boolean;
  includeTodos?: boolean;
  startTime?: string;
  endTime?: string;
}

export interface DuplicateTodoDto {
  targetDayId?: string;
  targetTimeBlockId?: string;
}

export interface ReorderTodosDto {
  orderedIds: string[];
}

export interface TodoFilterQuery {
  dayId?: string;
  timeBlockId?: string;
  isCompleted?: boolean;
  inbox?: boolean;
}

// Time Block Template types
export interface TemplateNote {
  id: string;
  content: string;
  order: number;
  templateId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimeBlockTemplate {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  color: string | null;
  daysOfWeek: number[];
  isActive: boolean;
  activeUntil: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  notes: TemplateNote[];
}

export interface CreateTimeBlockTemplateDto {
  name: string;
  startTime: string;
  endTime: string;
  color?: string;
  daysOfWeek: number[];
  notes?: { content: string; order: number }[];
}

export interface UpdateTimeBlockTemplateDto {
  name?: string;
  startTime?: string;
  endTime?: string;
  color?: string;
  daysOfWeek?: number[];
}

export interface DeactivateTemplateDto {
  activeUntil?: string;
  deleteFutureOccurrences?: boolean;
}

// Event types
export type RecurrenceType = 'NONE' | 'DAILY' | 'WEEKDAYS' | 'WEEKENDS' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface Event {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  color: string | null;
  isRecurring: boolean;
  recurrenceType: RecurrenceType;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventOccurrence extends Event {
  isOccurrence: boolean; // true if generated, false if original
  occurrenceDate: string; // Actual date of this occurrence
}

export interface CreateEventDto {
  title: string;
  date: string;
  color?: string;
  isRecurring?: boolean;
  recurrenceType?: RecurrenceType;
}

export interface UpdateEventDto {
  title?: string;
  date?: string;
  color?: string | null;
  isRecurring?: boolean;
  recurrenceType?: RecurrenceType;
}

export interface EventCalendarQuery {
  startDate: string;
  endDate: string;
}

// Calendar state
export type CalendarView = 'month' | 'week' | 'day';

export interface CalendarState {
  selectedDate: Date;
  currentView: CalendarView;
}

// Color palette for time blocks and events
export const BLOCK_COLORS = [
  { name: 'Blue', value: '#A5D8FF' },
  { name: 'Cyan', value: '#99E9F2' },
  { name: 'Teal', value: '#96F2D7' },
  { name: 'Green', value: '#B2F2BB' },
  { name: 'Lime', value: '#D8F5A2' },
  { name: 'Yellow', value: '#FFEC99' },
  { name: 'Orange', value: '#FFD8A8' },
  { name: 'Red', value: '#FFC9C9' },
  { name: 'Pink', value: '#FCC2D7' },
  { name: 'Grape', value: '#E599F7' },
  { name: 'Purple', value: '#D0BFFF' },
  { name: 'Indigo', value: '#BAC8FF' },
  { name: 'Gray', value: '#DEE2E6' },
  { name: 'Peach', value: '#FFDDD5' },
] as const;

export const DEFAULT_BLOCK_COLOR = '#A5D8FF';
