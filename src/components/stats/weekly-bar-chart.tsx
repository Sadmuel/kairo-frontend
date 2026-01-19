import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { DayStats } from '@/types/stats';
import { format, parseISO } from 'date-fns';

interface WeeklyBarChartProps {
  dailyStats: DayStats[];
  isLoading?: boolean;
}

interface ChartDataItem {
  name: string;
  fullDate: string;
  todos: number;
  totalTodos: number;
  timeBlocks: number;
  totalTimeBlocks: number;
  todoRate: number;
  timeBlockRate: number;
  isCompleted: boolean;
}

export function WeeklyBarChart({ dailyStats, isLoading }: WeeklyBarChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="p-4 sm:p-6 pb-2">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  // Transform data for Recharts
  const chartData: ChartDataItem[] = dailyStats.map((day) => ({
    name: format(parseISO(day.date), 'EEE'), // Mon, Tue, etc.
    fullDate: format(parseISO(day.date), 'MMM d'), // Jan 7, etc.
    todos: day.completedTodos,
    totalTodos: day.totalTodos,
    timeBlocks: day.completedTimeBlocks,
    totalTimeBlocks: day.totalTimeBlocks,
    todoRate: Math.round(day.todoCompletionRate),
    timeBlockRate: Math.round(day.timeBlockCompletionRate),
    isCompleted: day.isCompleted,
  }));

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6 pb-2">
        <CardTitle className="text-lg sm:text-xl">Weekly Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 10, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const data = payload[0].payload as ChartDataItem;
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-md">
                      <p className="font-medium">{data.fullDate}</p>
                      <div className="mt-2 space-y-1 text-sm">
                        <p className="text-green-600">
                          Todos: {data.todos}/{data.totalTodos} ({data.todoRate}
                          %)
                        </p>
                        <p className="text-blue-600">
                          Time Blocks: {data.timeBlocks}/{data.totalTimeBlocks} (
                          {data.timeBlockRate}%)
                        </p>
                        {data.isCompleted && (
                          <p className="font-medium text-amber-600">
                            Day Completed!
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }}
              />
              <Legend />
              <Bar
                dataKey="todos"
                name="Completed Todos"
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="timeBlocks"
                name="Completed Time Blocks"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
