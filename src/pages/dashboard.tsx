import { format } from 'date-fns';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useDashboard } from '@/hooks/use-dashboard';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  StreakWidget,
  TodayProgressWidget,
  TimeBlockListWidget,
  UpcomingEventsWidget,
} from '@/components/dashboard';

export default function Dashboard() {
  useDocumentTitle('Dashboard');
  const { user } = useAuth();
  const { data, isLoading, error, refetch } = useDashboard();

  if (error) {
    return (
      <main className="container mx-auto max-w-5xl px-3 py-4 sm:px-4 sm:py-6">
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-6 text-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Failed to load dashboard</p>
              <p className="text-xs text-muted-foreground">
                Something went wrong. Please try again.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-5xl px-3 py-4 sm:px-4 sm:py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold sm:text-3xl">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-4 sm:space-y-6">
            <TodayProgressWidget data={data?.today} isLoading={isLoading} />
            <TimeBlockListWidget data={data?.todayDetail} isLoading={isLoading} />
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6">
            <StreakWidget data={data?.streaks} isLoading={isLoading} />
            <UpcomingEventsWidget data={data?.upcomingEvents} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </main>
  );
}
