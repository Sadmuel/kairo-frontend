import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button variant="outline" onClick={handleLogout} disabled={isLoggingOut}>
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user?.name}!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-muted-foreground">
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

        <p className="text-center text-muted-foreground">
          This is a placeholder dashboard. More features coming soon!
        </p>
      </div>
    </div>
  );
}
