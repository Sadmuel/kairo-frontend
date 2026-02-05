import { http, HttpResponse } from 'msw';
import type { User, AuthResponse } from '@/types/auth';
import type { Todo, Day, TimeBlock, Event, Note } from '@/types/calendar';
import type { OverallStats, DayStats, WeekStats } from '@/types/stats';
import type { DashboardResponse, DashboardTimeBlock, DashboardEvent } from '@/types/dashboard';

const API_URL = 'http://localhost:3000';

// Mock data factories
export const mockUser: User = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  isDemoUser: false,
  currentStreak: 5,
  longestStreak: 10,
  lastCompletedDate: '2024-01-15',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-15T00:00:00.000Z',
};

export const mockAuthResponse: AuthResponse = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  user: mockUser,
};

export const mockTodo: Todo = {
  id: 'todo-1',
  title: 'Test Todo',
  isCompleted: false,
  deadline: null,
  order: 0,
  userId: 'user-1',
  dayId: 'day-1',
  timeBlockId: null,
  createdAt: '2024-01-15T00:00:00.000Z',
  updatedAt: '2024-01-15T00:00:00.000Z',
};

export const mockNote: Note = {
  id: 'note-1',
  content: 'Test note content',
  order: 0,
  timeBlockId: 'time-block-1',
  createdAt: '2024-01-15T00:00:00.000Z',
  updatedAt: '2024-01-15T00:00:00.000Z',
};

export const mockTimeBlock: TimeBlock = {
  id: 'time-block-1',
  name: 'Morning Routine',
  startTime: '08:00',
  endTime: '10:00',
  isCompleted: false,
  order: 0,
  color: '#A5D8FF',
  dayId: 'day-1',
  templateId: null,
  createdAt: '2024-01-15T00:00:00.000Z',
  updatedAt: '2024-01-15T00:00:00.000Z',
  notes: [mockNote],
  todos: [],
};

export const mockDay: Day = {
  id: 'day-1',
  date: '2024-01-15',
  isCompleted: false,
  userId: 'user-1',
  createdAt: '2024-01-15T00:00:00.000Z',
  updatedAt: '2024-01-15T00:00:00.000Z',
  timeBlocks: [mockTimeBlock],
  todos: [mockTodo],
};

export const mockEvent: Event = {
  id: 'event-1',
  title: 'Test Event',
  date: '2024-01-15',
  color: '#B2F2BB',
  isRecurring: false,
  recurrenceType: 'NONE',
  userId: 'user-1',
  createdAt: '2024-01-15T00:00:00.000Z',
  updatedAt: '2024-01-15T00:00:00.000Z',
};

export const mockOverallStats: OverallStats = {
  currentStreak: 5,
  longestStreak: 10,
  lastCompletedDate: '2024-01-15',
  totalCompletedDays: 25,
  totalDays: 30,
  overallDayCompletionRate: 83.33,
};

export const mockDayStats: DayStats = {
  date: '2024-01-15',
  dayExists: true,
  isCompleted: false,
  completedTodos: 5,
  totalTodos: 8,
  todoCompletionRate: 62.5,
  completedTimeBlocks: 2,
  totalTimeBlocks: 4,
  timeBlockCompletionRate: 50,
};

export const mockWeekStats: WeekStats = {
  weekStart: '2024-01-08',
  weekEnd: '2024-01-14',
  completedDays: 5,
  totalDays: 7,
  completedTodos: 35,
  totalTodos: 42,
  todoCompletionRate: 83.33,
  completedTimeBlocks: 15,
  totalTimeBlocks: 21,
  timeBlockCompletionRate: 71.43,
  dailyStats: [mockDayStats],
};

export const mockDashboardTimeBlock: DashboardTimeBlock = {
  id: 'time-block-1',
  name: 'Morning Routine',
  startTime: '08:00',
  endTime: '10:00',
  isCompleted: false,
  order: 0,
  color: '#A5D8FF',
  notes: [{ id: 'note-1', content: 'Test note', order: 0 }],
  todos: [{ id: 'todo-1', title: 'Test todo', isCompleted: false, deadline: null, order: 0 }],
};

export const mockDashboardEvent: DashboardEvent = {
  id: 'event-1',
  title: 'Test Event',
  date: '2024-01-15',
  color: '#B2F2BB',
  isRecurring: false,
  recurrenceType: 'NONE',
  isOccurrence: false,
  occurrenceDate: '2024-01-15',
};

export const mockDashboardResponse: DashboardResponse = {
  streaks: {
    currentStreak: 5,
    longestStreak: 10,
    lastCompletedDate: '2024-01-15',
    totalCompletedDays: 25,
    totalDays: 30,
    overallDayCompletionRate: 83.33,
  },
  today: {
    date: '2024-01-15',
    dayExists: true,
    isCompleted: false,
    completedTodos: 5,
    totalTodos: 8,
    todoCompletionRate: 62.5,
    completedTimeBlocks: 2,
    totalTimeBlocks: 4,
    timeBlockCompletionRate: 50,
  },
  todayDetail: {
    id: 'day-1',
    date: '2024-01-15',
    isCompleted: false,
    timeBlocks: [mockDashboardTimeBlock],
    todos: [{ id: 'todo-2', title: 'Day todo', isCompleted: false, deadline: null, order: 0 }],
  },
  upcomingEvents: [mockDashboardEvent],
};

// Handlers
export const handlers = [
  // Auth handlers
  http.post(`${API_URL}/auth/register`, () => {
    return HttpResponse.json(mockUser);
  }),

  http.post(`${API_URL}/auth/login`, () => {
    return HttpResponse.json(mockAuthResponse);
  }),

  http.post(`${API_URL}/auth/refresh`, () => {
    return HttpResponse.json(mockAuthResponse);
  }),

  http.post(`${API_URL}/auth/logout`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${API_URL}/auth/me`, () => {
    return HttpResponse.json(mockUser);
  }),

  // Todos handlers
  http.get(`${API_URL}/todos`, () => {
    return HttpResponse.json([mockTodo]);
  }),

  http.get(`${API_URL}/todos/:id`, () => {
    return HttpResponse.json(mockTodo);
  }),

  http.post(`${API_URL}/todos`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({
      ...mockTodo,
      id: 'new-todo-id',
      title: body.title as string,
    });
  }),

  // Note: More specific routes must come before parameterized routes
  http.patch(`${API_URL}/todos/reorder`, async () => {
    return HttpResponse.json([mockTodo]);
  }),

  http.patch(`${API_URL}/todos/:id/move`, async ({ params }) => {
    return HttpResponse.json({
      ...mockTodo,
      id: params.id as string,
    });
  }),

  http.patch(`${API_URL}/todos/:id`, async ({ request, params }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({
      ...mockTodo,
      id: params.id as string,
      ...body,
    });
  }),

  http.delete(`${API_URL}/todos/:id`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // Days handlers
  http.get(`${API_URL}/days`, () => {
    return HttpResponse.json([mockDay]);
  }),

  http.get(`${API_URL}/days/date/:date`, () => {
    return HttpResponse.json(mockDay);
  }),

  http.get(`${API_URL}/days/:id`, () => {
    return HttpResponse.json(mockDay);
  }),

  http.post(`${API_URL}/days`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({
      ...mockDay,
      id: 'new-day-id',
      date: body.date as string,
    });
  }),

  http.patch(`${API_URL}/days/:id`, async ({ request, params }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({
      ...mockDay,
      id: params.id as string,
      ...body,
    });
  }),

  http.delete(`${API_URL}/days/:id`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // Time blocks handlers
  http.get(`${API_URL}/time-blocks`, () => {
    return HttpResponse.json([mockTimeBlock]);
  }),

  http.get(`${API_URL}/time-blocks/:id`, () => {
    return HttpResponse.json(mockTimeBlock);
  }),

  http.post(`${API_URL}/time-blocks`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({
      ...mockTimeBlock,
      id: 'new-time-block-id',
      name: body.name as string,
    });
  }),

  // Note: More specific routes must come before parameterized routes
  http.patch(`${API_URL}/time-blocks/reorder`, () => {
    return HttpResponse.json([mockTimeBlock]);
  }),

  http.patch(`${API_URL}/time-blocks/:id`, async ({ request, params }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({
      ...mockTimeBlock,
      id: params.id as string,
      ...body,
    });
  }),

  http.delete(`${API_URL}/time-blocks/:id`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // Notes handlers
  http.get(`${API_URL}/notes`, () => {
    return HttpResponse.json([mockNote]);
  }),

  http.post(`${API_URL}/notes`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({
      ...mockNote,
      id: 'new-note-id',
      content: body.content as string,
    });
  }),

  // Note: More specific routes must come before parameterized routes
  http.patch(`${API_URL}/notes/reorder`, () => {
    return HttpResponse.json([mockNote]);
  }),

  http.patch(`${API_URL}/notes/:id`, async ({ request, params }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({
      ...mockNote,
      id: params.id as string,
      ...body,
    });
  }),

  http.delete(`${API_URL}/notes/:id`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // Events handlers
  http.get(`${API_URL}/events`, () => {
    return HttpResponse.json([mockEvent]);
  }),

  http.get(`${API_URL}/events/calendar`, () => {
    return HttpResponse.json([mockEvent]);
  }),

  http.get(`${API_URL}/events/:id`, () => {
    return HttpResponse.json(mockEvent);
  }),

  http.post(`${API_URL}/events`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({
      ...mockEvent,
      id: 'new-event-id',
      title: body.title as string,
    });
  }),

  http.patch(`${API_URL}/events/:id`, async ({ request, params }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({
      ...mockEvent,
      id: params.id as string,
      ...body,
    });
  }),

  http.delete(`${API_URL}/events/:id`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // Stats handlers
  http.get(`${API_URL}/users/me/stats`, () => {
    return HttpResponse.json(mockOverallStats);
  }),

  http.get(`${API_URL}/users/me/stats/day/:date`, () => {
    return HttpResponse.json(mockDayStats);
  }),

  http.get(`${API_URL}/users/me/stats/week/:date`, () => {
    return HttpResponse.json(mockWeekStats);
  }),

  // Dashboard handlers
  http.get(`${API_URL}/users/me/dashboard`, () => {
    return HttpResponse.json(mockDashboardResponse);
  }),

  http.get(`${API_URL}/dashboard`, () => {
    return HttpResponse.json(mockDashboardResponse);
  }),
];
