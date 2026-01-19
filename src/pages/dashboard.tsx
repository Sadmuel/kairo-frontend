import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <main className="container mx-auto max-w-4xl px-3 py-4 sm:px-4 sm:py-6">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Dashboard</h1>

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
    </main>
  );
}
