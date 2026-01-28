import { useState, FormEvent } from 'react';
import { toast } from 'sonner';
import { Link, useNavigate, useLocation, Location } from 'react-router-dom';
import { Play, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useTutorial } from '@/hooks/use-tutorial';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { getErrorMessage } from '@/lib/error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface LocationState {
  from?: Location;
}

export default function Login() {
  useDocumentTitle('Login');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginDemo } = useAuth();
  const { startTutorial } = useTutorial();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const handleDemoLogin = async () => {
    setError('');
    setIsDemoLoading(true);

    try {
      await loginDemo();
      toast.success('Welcome to the demo!');
      startTutorial();
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to create demo account. Please try again.'));
    } finally {
      setIsDemoLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login({ email: email.trim(), password });
      toast.success('Welcome back!');
      // Navigate to the original destination or default to dashboard
      const state = location.state as LocationState | null;
      const destination = state?.from?.pathname ?? '/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Invalid credentials'));
      // Using inline error only - user is looking at the form
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Kairo</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isSubmitting || isDemoLoading}>
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>

            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed border-2"
              onClick={handleDemoLogin}
              disabled={isDemoLoading || isSubmitting}
            >
              {isDemoLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              {isDemoLoading ? 'Setting up demo...' : 'Try Demo — No Sign Up Required'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Register
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
