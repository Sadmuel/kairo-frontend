import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';
import { AuthProvider } from '@/context/auth-context';
import { ThemeProvider } from '@/context/theme-context';
import { CalendarProvider } from '@/context/calendar-context';

// Create a fresh query client for each test
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

interface WrapperOptions {
  initialEntries?: MemoryRouterProps['initialEntries'];
  withAuth?: boolean;
  withTheme?: boolean;
  withCalendar?: boolean;
  queryClient?: QueryClient;
}

function createWrapper(options: WrapperOptions = {}) {
  const {
    initialEntries = ['/'],
    withAuth = true,
    withTheme = true,
    withCalendar = false,
    queryClient = createTestQueryClient(),
  } = options;

  return function Wrapper({ children }: { children: ReactNode }) {
    let content = children;

    // Wrap in CalendarProvider if needed (must be inside Router)
    if (withCalendar) {
      content = <CalendarProvider>{content}</CalendarProvider>;
    }

    // Wrap in ThemeProvider if needed
    if (withTheme) {
      content = <ThemeProvider>{content}</ThemeProvider>;
    }

    // Wrap in AuthProvider if needed
    if (withAuth) {
      content = <AuthProvider>{content}</AuthProvider>;
    }

    // Always wrap in QueryClientProvider and MemoryRouter
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>{content}</MemoryRouter>
      </QueryClientProvider>
    );
  };
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: MemoryRouterProps['initialEntries'];
  withAuth?: boolean;
  withTheme?: boolean;
  withCalendar?: boolean;
  queryClient?: QueryClient;
}

function customRender(
  ui: ReactElement,
  options: CustomRenderOptions = {}
): ReturnType<typeof render> & { queryClient: QueryClient } {
  const {
    initialEntries,
    withAuth,
    withTheme,
    withCalendar,
    queryClient = createTestQueryClient(),
    ...renderOptions
  } = options;

  const wrapper = createWrapper({
    initialEntries,
    withAuth,
    withTheme,
    withCalendar,
    queryClient,
  });

  return {
    ...render(ui, { wrapper, ...renderOptions }),
    queryClient,
  };
}

// Re-export everything from testing-library
// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react';
export { userEvent } from '@testing-library/user-event';

// Override render with custom render
export { customRender as render, createTestQueryClient, createWrapper };
