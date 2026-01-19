import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/auth-context';
import { ThemeProvider } from '@/context/theme-context';
import { GuestRoute } from '../guest-route';
import { tokenStore } from '@/services/api';
import { ReactNode } from 'react';

function TestWrapper({
  children,
  initialEntries = ['/login'],
}: {
  children: ReactNode;
  initialEntries?: string[];
}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

function TestRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<div>Dashboard Page</div>} />
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/register" element={<div>Register Page</div>} />
      </Route>
    </Routes>
  );
}

describe('GuestRoute', () => {
  beforeEach(() => {
    tokenStore.clearTokens();
  });

  it('shows guest content when not authenticated', async () => {
    // No refresh token = not authenticated
    render(
      <TestWrapper>
        <TestRoutes />
      </TestWrapper>
    );

    await waitFor(
      () => {
        expect(screen.getByText('Login Page')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  it('redirects to dashboard when authenticated', async () => {
    // Set up authenticated state
    tokenStore.setRefreshToken('valid-refresh-token');

    render(
      <TestWrapper>
        <TestRoutes />
      </TestWrapper>
    );

    await waitFor(
      () => {
        expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  it('allows access to register page when not authenticated', async () => {
    render(
      <TestWrapper initialEntries={['/register']}>
        <TestRoutes />
      </TestWrapper>
    );

    await waitFor(
      () => {
        expect(screen.getByText('Register Page')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });
});
