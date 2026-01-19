import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/auth-context';
import { ThemeProvider } from '@/context/theme-context';
import { ProtectedRoute } from '../protected-route';
import { tokenStore } from '@/services/api';
import { ReactNode } from 'react';

function TestWrapper({
  children,
  initialEntries = ['/protected'],
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
      <Route path="/login" element={<div>Login Page</div>} />
      <Route path="/protected" element={<ProtectedRoute />}>
        <Route index element={<div>Protected Content</div>} />
      </Route>
    </Routes>
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    tokenStore.clearTokens();
  });

  it('redirects to login when not authenticated', async () => {
    // No refresh token set = not authenticated
    render(
      <TestWrapper>
        <TestRoutes />
      </TestWrapper>
    );

    // Should redirect to login eventually
    await waitFor(
      () => {
        expect(screen.getByText('Login Page')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  it('does not show login page when authenticated', async () => {
    // Set up authenticated state
    tokenStore.setRefreshToken('valid-refresh-token');

    render(
      <TestWrapper>
        <TestRoutes />
      </TestWrapper>
    );

    // When authenticated, should NOT redirect to login
    await waitFor(
      () => {
        expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });
});
