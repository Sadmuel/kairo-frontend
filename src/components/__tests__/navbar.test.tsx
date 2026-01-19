import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/auth-context';
import { ThemeProvider } from '@/context/theme-context';
import { Navbar } from '../layout/navbar';
import { tokenStore } from '@/services/api';
import { ReactNode } from 'react';

function TestWrapper({ children, initialPath = '/dashboard' }: { children: ReactNode; initialPath?: string }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('Navbar', () => {
  beforeEach(() => {
    tokenStore.clearTokens();
    localStorage.clear();
    // Set up authenticated state for navbar tests
    tokenStore.setRefreshToken('test-refresh-token');
  });

  describe('rendering', () => {
    it('renders brand name', async () => {
      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Kairo')).toBeInTheDocument();
      });
    });

    it('renders navigation links', async () => {
      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /calendar/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /inbox/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /stats/i })).toBeInTheDocument();
      });
    });

    it('renders logout button', async () => {
      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
      });
    });

    it('renders theme toggle button', async () => {
      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument();
      });
    });
  });

  describe('active state', () => {
    it('highlights active navigation item', async () => {
      render(
        <TestWrapper initialPath="/dashboard">
          <Navbar />
        </TestWrapper>
      );

      await waitFor(() => {
        const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
        // The active link should have secondary variant styling
        expect(dashboardLink.closest('a')).toHaveClass('bg-secondary');
      });
    });
  });

  describe('mobile menu', () => {
    it('renders mobile menu toggle button', async () => {
      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /toggle menu/i })).toBeInTheDocument();
      });
    });

    it('toggles mobile menu on button click', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>
      );

      const menuButton = screen.getByRole('button', { name: /toggle menu/i });

      // Click to open the menu
      await user.click(menuButton);

      // The menu should be visible and contain navigation items
      await waitFor(() => {
        // Mobile menu should show theme options when open
        expect(screen.getAllByRole('button', { name: /light/i }).length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('theme switching', () => {
    it('opens theme popover on click', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Navbar />
        </TestWrapper>
      );

      const themeButton = screen.getByRole('button', { name: /toggle theme/i });
      await user.click(themeButton);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /light/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /dark/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /system/i })).toBeInTheDocument();
      });
    });
  });
});
