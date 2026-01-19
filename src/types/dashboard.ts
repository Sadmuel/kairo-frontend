import type { RecurrenceType } from './calendar';

// Streaks information
export interface DashboardStreaks {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  totalCompletedDays: number;
  totalDays: number;
  overallDayCompletionRate: number;
}

// Today's summary stats
export interface DashboardTodayStats {
  date: string;
  dayExists: boolean;
  isCompleted: boolean;
  completedTodos: number;
  totalTodos: number;
  todoCompletionRate: number;
  completedTimeBlocks: number;
  totalTimeBlocks: number;
  timeBlockCompletionRate: number;
}

// Simplified note for dashboard
export interface DashboardNote {
  id: string;
  content: string;
  order: number;
}

// Simplified todo for dashboard
export interface DashboardTodo {
  id: string;
  title: string;
  isCompleted: boolean;
  deadline: string | null;
  order: number;
}

// Simplified time block for dashboard
export interface DashboardTimeBlock {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  isCompleted: boolean;
  order: number;
  color: string | null;
  notes: DashboardNote[];
  todos: DashboardTodo[];
}

// Today's detailed information
export interface DashboardTodayDetail {
  id: string;
  date: string;
  isCompleted: boolean;
  timeBlocks: DashboardTimeBlock[];
  todos: DashboardTodo[];
}

// Upcoming event with occurrence info
export interface DashboardEvent {
  id: string;
  title: string;
  date: string;
  color: string | null;
  isRecurring: boolean;
  recurrenceType: RecurrenceType;
  isOccurrence: boolean;
  occurrenceDate: string;
}

// Complete dashboard response
export interface DashboardResponse {
  streaks: DashboardStreaks;
  today: DashboardTodayStats;
  todayDetail: DashboardTodayDetail | null;
  upcomingEvents: DashboardEvent[];
}
