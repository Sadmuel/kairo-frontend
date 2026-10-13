# Kairo Frontend

A modern productivity web application combining time-blocking, routines, and task management. Built with React, TypeScript, and Tailwind CSS.

## Overview

Kairo is a calendar/planner application designed to help users organize their days through customizable time blocks, recurring events, and task lists. Unlike traditional calendar apps, Kairo focuses on dividing days into time blocks where users can assign specific tasks and notes.

The name comes from "kairos" (Greek for "the right moment").

## Features

- **Calendar Views** - Monthly, weekly, and daily views with smooth navigation
- **Time Blocks** - Divide days into custom time sections, automatically ordered by start time in the daily view and dashboard schedule
- **Todos** - General day todos and time block-specific todos with drag-and-drop reordering
- **Events** - Create events with recurrence support (daily, weekly, monthly, yearly)
- **Statistics** - Track completion rates and streaks
- **Dark Mode** - Full dark mode support with system preference detection
- **Responsive Design** - Mobile-first design that works on all screen sizes
- **Keyboard Shortcuts** - Navigate quickly with keyboard shortcuts (T for today, Esc to close modals)

## Tech Stack

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS with tailwindcss-animate
- **State Management:** TanStack React Query (server state) + React Context (client state)
- **Routing:** React Router v7
- **HTTP Client:** Axios with automatic token refresh
- **UI Components:** Radix UI primitives + custom shadcn-inspired components
- **Drag & Drop:** dnd-kit for todos and notes; time blocks use chronological ordering in Day and the dashboard schedule
- **Charts:** Recharts
- **Testing:** Vitest + Testing Library + MSW
- **Package Manager:** pnpm

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm
- Kairo Backend running (see [kairo-backend](https://github.com/USER/kairo-backend))

### Installation

```bash
# Clone the repository
git clone https://github.com/USER/kairo-frontend.git
cd kairo-frontend

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Start development server
pnpm dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000
```

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run tests in watch mode |
| `pnpm test:run` | Run tests once |
| `pnpm test:coverage` | Run tests with coverage report |

## Project Structure

```
src/
├── components/          # React components
│   ├── calendar/       # Calendar views (month, week, day)
│   ├── dashboard/      # Dashboard widgets
│   ├── events/         # Event components
│   ├── layout/         # App layout and navbar
│   ├── notes/          # Note components
│   ├── stats/          # Statistics components
│   ├── time-blocks/    # Time block components
│   ├── todos/          # Todo components
│   └── ui/             # Base UI components (button, input, etc.)
├── context/            # React Context providers
│   ├── auth-context    # Authentication state
│   ├── calendar-context # Calendar navigation state
│   └── theme-context   # Theme (light/dark/system)
├── hooks/              # Custom React hooks
│   ├── use-auth        # Auth context hook
│   ├── use-calendar    # Calendar context hook
│   ├── use-days        # Days data fetching
│   ├── use-events      # Events data fetching
│   ├── use-keyboard-shortcuts # Keyboard shortcuts
│   ├── use-notes       # Notes data fetching
│   ├── use-stats       # Statistics data fetching
│   ├── use-theme       # Theme context hook
│   ├── use-time-blocks # Time blocks data fetching
│   └── use-todos       # Todos data fetching
├── lib/                # Utility functions
│   ├── calendar-colors # Shared calendar surface colors and accent widths
│   ├── date-utils      # Date formatting helpers
│   ├── error           # Error handling utilities
│   ├── query-client    # TanStack Query configuration
│   └── utils           # General utilities (cn)
├── pages/              # Page components
│   ├── calendar        # Calendar page
│   ├── dashboard       # Dashboard page
│   ├── login           # Login page
│   ├── register        # Register page
│   ├── stats           # Statistics page
│   └── todos           # Inbox/todos page
├── services/           # API service layer
│   ├── api             # Axios instance with interceptors
│   ├── auth            # Auth API calls
│   ├── dashboard       # Dashboard API calls
│   ├── days            # Days API calls
│   ├── events          # Events API calls
│   ├── notes           # Notes API calls
│   ├── stats           # Stats API calls
│   ├── time-blocks     # Time blocks API calls
│   └── todos           # Todos API calls
├── test/               # Test utilities and mocks
│   ├── mocks/          # MSW handlers and mock data
│   ├── setup.ts        # Test setup file
│   └── test-utils.tsx  # Custom render with providers
├── types/              # TypeScript type definitions
├── App.tsx             # Root component with routing
└── main.tsx            # Application entry point
```

## Testing

The project uses Vitest for testing with React Testing Library for component tests and MSW (Mock Service Worker) for API mocking.

```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test:run

# Run Day and dashboard time block ordering regression tests
pnpm test:run src/components/__tests__/time-block-list.test.tsx src/components/__tests__/time-block-list-widget.test.tsx

# Run tests with coverage
pnpm test:coverage
```

### Test Coverage

| Category | Statement Coverage |
|----------|-------------------|
| **Overall** | 84%+ |
| Context Providers | 94%+ |
| Hooks | 81%+ |
| Services | 71%+ |
| Components | 77%+ |
| Utilities | 100% |

### Test Structure

Tests are co-located with source files in `__tests__` directories:

```
src/
├── components/
│   └── __tests__/
│       ├── time-block-list.test.tsx
│       ├── time-block-list-widget.test.tsx
│       └── ...
├── lib/
│   └── __tests__/
│       ├── date-utils.test.ts
│       └── error.test.ts
├── services/
│   └── __tests__/
│       ├── auth.test.ts
│       ├── todos.test.ts
│       └── ...
├── context/
│   └── __tests__/
│       ├── auth-context.test.tsx
│       ├── theme-context.test.tsx
│       └── calendar-context.test.tsx
└── hooks/
    └── __tests__/
        ├── use-auth.test.tsx
        └── use-keyboard-shortcuts.test.tsx
```

`TimeBlockList` tests cover chronological ordering (including midnight), equal start times resolved by `order`, immutable input, added/edited blocks retaining expanded state by ID, available card actions without a drag handle, and the empty state. `TimeBlockListWidget` tests cover the same ordering rule before the five-item limit, overflow counts, immutable input, and repositioning after a start-time update. The obsolete time block reorder service test and MSW route have been removed. Color, contrast, and responsive layout require browser verification; these component tests do not validate rendered `color-mix()` output.

## Architecture Decisions

### State Management

- **Server State:** TanStack React Query manages all server data with automatic caching, background refetching, and optimistic updates
- **Client State:** React Context for auth, theme, and calendar navigation state
- **URL State:** Calendar date and view are stored in URL params for shareable links

### Authentication

- JWT-based authentication with access and refresh tokens
- Access token stored in memory (not localStorage) for security
- Refresh token stored in localStorage for persistence
- Automatic token refresh on 401 responses with request queuing

### API Layer

- Axios instance with request/response interceptors
- Automatic authorization header injection
- Centralized error handling with typed error responses

### Component Design

- Compound components for complex UI (dialogs, popovers)
- Custom hooks for data fetching with React Query
- Presentational/container component separation where appropriate

### Time Block Ordering

In Day, [`TimeBlockList`](src/components/time-blocks/time-block-list.tsx) sorts a copy of `day.timeBlocks` by `startTime` ascending, then by numeric `order` ascending when start times match. The dashboard's [`TimeBlockListWidget`](src/components/dashboard/time-block-list-widget.tsx) applies the same rule to a copy of its time blocks before showing the first five. Times use the existing zero-padded 24-hour `HH:mm` format. Names and end times do not determine list order.

Both sorts are derived during rendering: they do not mutate the arrays from React Query or save a new order. Added, duplicated, recurring, or edited blocks take their chronological position when refreshed data reaches each list. Day cards keep their block ID as the React key, preserving local expanded state as their positions change.

| Surface | Time block ordering or placement |
|---------|---------------------------------|
| Day | `startTime`, then `order`; no manual drag reordering |
| Week | Positioned by start/end time in the time grid |
| Month | Up to three solid dots from the received array, with an additional-count label on larger screens |
| Dashboard schedule | `startTime`, then `order`; sorts all blocks before showing the first five |

The frontend no longer exposes `useReorderTimeBlocks`, `timeBlocksService.reorder`, or `ReorderTimeBlocksDto`, and no longer calls `PATCH /time-blocks/reorder`. `TimeBlock.order` and optional `CreateTimeBlockDto.order` remain in the data contract. This client change does not remove a backend endpoint or migrate stored data. Todo and note drag-and-drop behavior is unchanged.

### Calendar Colors

[`calendar-colors.ts`](src/lib/calendar-colors.ts) shares the soft background and solid accent treatment between Day time block and event cards, Week time blocks, event badges in Week/Month, and the dashboard's Today's Schedule and Upcoming Events rows. It reuses saved colors and `DEFAULT_BLOCK_COLOR`, including custom colors, without changing the palette or persisted values.

Completed time blocks retain their color and use a muted, struck-through title; Day also retains its completion checkbox and the dashboard retains its completion icon. Day cards use a 6 px accent, while compact calendar items and dashboard rows use 3 px. Upcoming event date tiles use a neutral, theme-aware background. Month time block dots remain solid, and dashboard statistics widgets keep their existing presentation. See [Calendar Color Surfaces](docs/UI_RESPONSIVENESS_STANDARDS.md#calendar-color-surfaces) for exact values, contrast rules, and responsive checks.

## API Integration

This frontend requires the [Kairo Backend](https://github.com/USER/kairo-backend) to be running. The backend provides:

- User authentication (register, login, logout, token refresh)
- Days, time blocks, and notes CRUD
- Todos with inbox and time block assignment
- Events with recurrence support
- Statistics and dashboard data

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes using conventional commits
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## License

This project is private and not licensed for public use.

---

Built with React, TypeScript, and Tailwind CSS.
