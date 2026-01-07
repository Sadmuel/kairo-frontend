import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Inbox } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:p-8">
      <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8">
        {/* Header - stacks on mobile */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold sm:text-3xl">Dashboard</h1>
          <div className="flex gap-2">
            <Button asChild className="h-10 flex-1 sm:h-9 sm:flex-none">
              <Link to="/calendar">
                <Calendar className="mr-2 h-4 w-4" />
                Calendar
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-10 flex-1 sm:h-9 sm:flex-none">
              <Link to="/todos">
                <Inbox className="mr-2 h-4 w-4" />
                Inbox
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="h-10 flex-1 sm:h-9 sm:flex-none"
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Welcome, {user?.name}!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-4 pt-0 sm:p-6 sm:pt-0">
            <p className="text-sm text-muted-foreground sm:text-base">
              You are logged in as <span className="font-medium">{user?.email}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Current streak: {user?.currentStreak} days
            </p>
            <p className="text-sm text-muted-foreground">
              Longest streak: {user?.longestStreak} days
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground sm:text-base">
          This is a placeholder dashboard. More features coming soon!
        </p>
      </div>
    </div>
  );
}
