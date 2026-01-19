import { Flame, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  isLoading?: boolean;
}

export function StreakCard({
  currentStreak,
  longestStreak,
  isLoading,
}: StreakCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="p-4 sm:p-6 pb-2">
          <Skeleton className="h-5 w-24" />
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6 pb-2">
        <CardTitle className="text-lg sm:text-xl">Streak</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
              <Flame className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{currentStreak}</p>
              <p className="text-xs text-muted-foreground">Current</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20">
              <Trophy className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{longestStreak}</p>
              <p className="text-xs text-muted-foreground">Longest</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
