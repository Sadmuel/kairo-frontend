// Overall user statistics from GET /users/me/stats
export interface OverallStats {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  totalCompletedDays: number;
  totalDays: number;
  overallDayCompletionRate: number; // 0-100
}

// Day-specific statistics from GET /users/me/stats/day/:date
export interface DayStats {
  date: string;
  dayExists: boolean;
  isCompleted: boolean;
  completedTodos: number;
  totalTodos: number;
  todoCompletionRate: number; // 0-100
  completedTimeBlocks: number;
  totalTimeBlocks: number;
  timeBlockCompletionRate: number; // 0-100
}

// Week statistics from GET /users/me/stats/week/:date
export interface WeekStats {
  weekStart: string;
  weekEnd: string;
  completedDays: number;
  totalDays: number;
  completedTodos: number;
  totalTodos: number;
  todoCompletionRate: number;
  completedTimeBlocks: number;
  totalTimeBlocks: number;
  timeBlockCompletionRate: number;
  dailyStats: DayStats[];
}
