import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from '@vercel/analytics/react';
import { queryClient } from '@/lib/query-client';
import { AuthProvider } from '@/context/auth-context';
import { ThemeProvider } from '@/context/theme-context';
import { TutorialProvider } from '@/context/tutorial-context';
import { CalendarProvider } from '@/context/calendar-context';
import { ProtectedRoute } from '@/components/protected-route';
import { GuestRoute } from '@/components/guest-route';
import { TutorialOverlay } from '@/components/tutorial/tutorial-overlay';
import { Toaster } from '@/components/ui/sonner';
import Login from '@/pages/login';
import Register from '@/pages/register';
import Dashboard from '@/pages/dashboard';
import CalendarPage from '@/pages/calendar';
import TodosPage from '@/pages/todos';
import StatsPage from '@/pages/stats';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <TutorialProvider>
              <Routes>
                {/* Root redirects to dashboard (will redirect to login if not authenticated) */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* Guest-only routes (redirect to dashboard if authenticated) */}
                <Route element={<GuestRoute />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Route>

                {/* Protected routes (require authentication) */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route
                    path="/calendar"
                    element={
                      <CalendarProvider>
                        <CalendarPage />
                      </CalendarProvider>
                    }
                  />
                  <Route path="/todos" element={<TodosPage />} />
                  <Route path="/stats" element={<StatsPage />} />
                </Route>
              </Routes>
              <TutorialOverlay />
              <Toaster />
            </TutorialProvider>
          </BrowserRouter>
          <Analytics />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
