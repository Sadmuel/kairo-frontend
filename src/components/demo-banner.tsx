import { useAuth } from '@/hooks/use-auth';

export function DemoBanner() {
  const { user, logout } = useAuth();

  if (!user?.isDemoUser) return null;

  const handleRegister = async () => {
    await logout();
    window.location.href = '/register';
  };

  return (
    <div className="border-b bg-primary/10 px-4 py-2 text-center text-sm">
      <span className="font-medium text-primary">
        You&apos;re using a demo account.
      </span>{' '}
      <button
        onClick={handleRegister}
        className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
      >
        Create a real account
      </button>{' '}
      <span className="text-muted-foreground">to keep your data.</span>
    </div>
  );
}
