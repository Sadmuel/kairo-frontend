# Kairo

A productivity web application combining time-blocking, routines, and task management.

This document contains the product overview and original project roadmap. For the current frontend setup and implementation details, see the [frontend README](README.md).

## Overview

Kairo is a calendar/planner application with unique features that help users organize their days through time blocks, routines, and task lists. The name comes from "kairos" (Greek for "the right moment").

## Core Concept

Unlike traditional calendar apps, Kairo focuses on dividing days into customizable time blocks where users can assign specific tasks and notes. This approach combines the structure of time-blocking with the flexibility of todo lists.

## Features

### MVP Features

#### Calendar Views
- Monthly view
- Weekly view
- Daily view

#### Events
- Create events on specific dates
- Recurring events (daily, weekly, monthly, yearly)
- Events are date-specific (birthdays, holidays, appointments)

#### Time Blocks
- Divide days into custom time sections (e.g., "Morning Routine", "Work", "Exercise")
- Assign start and end times to each block
- Add todos specific to each time block
- Add notes to time blocks
- Mark time blocks as completed
- Automatically display time blocks in Day and the dashboard schedule by start time, using `order` to break ties; the dashboard shows the first five after sorting
- Reposition blocks in Day and the dashboard schedule when their start time changes; manual time block drag reordering is unavailable
- Keep block colors visible with soft backgrounds in Day, Week, and the dashboard schedule, including completed blocks

#### Todos
- General todos for a specific day
- Todos within time blocks
- Optional deadlines
- Mark as completed
- Move todos between time blocks and general day todos
- Reorder via drag & drop

#### Statistics
- Percentage of todos completed
- Streak tracking (consecutive days with all time blocks completed)

#### User Features
- User registration and authentication
- Personal dashboard with daily overview

### Post-MVP Features (V2)
- Pomodoro timer integrated with time blocks
- Export to Google Calendar / iCal
- Predefined routine templates
- Advanced analytics (completion rates by week, time spent per category)

## Tech Stack

### Backend (`kairo-backend`)
- **Runtime:** Node.js 22+
- **Framework:** NestJS 11
- **Language:** TypeScript
- **ORM:** Prisma 6
- **Database:** PostgreSQL 16
- **Authentication:** JWT with Passport
- **Documentation:** Swagger
- **Package Manager:** pnpm

### Frontend (`kairo-frontend`)
- **Framework:** React 19 with Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS 3
- **State Management:** React Context (auth/theme/calendar) + TanStack Query (server state)
- **Routing:** React Router v7
- **HTTP Client:** Axios
- **UI Components:** Radix UI primitives + custom shadcn-inspired components
- **Package Manager:** pnpm

### DevOps
- **Containerization:** Docker + docker-compose (local development)
- **CI/CD:** GitHub Actions
- **Backend Hosting:** Render (free tier)
- **Frontend Hosting:** Vercel
- **Database Hosting:** Neon (free tier)

### Git Workflow
- Conventional commits
- Branches: `main` (production), `development` (development), feature branches
- Pull requests required for merging to main/development

## Data Model

```
User
├── id (uuid)
├── email (unique)
├── passwordHash
├── name
├── currentStreak
├── longestStreak
├── lastCompletedDate
├── createdAt
├── updatedAt
│
├── Days[]
├── Events[]
└── Todos[]

Day
├── id (uuid)
├── date
├── isCompleted
├── userId
├── createdAt
├── updatedAt
│
├── User (belongs to)
├── TimeBlocks[]
└── Todos[]

TimeBlock
├── id (uuid)
├── name
├── startTime
├── endTime
├── isCompleted
├── order (retained; breaks equal start times in Day and the dashboard schedule)
├── color (optional)
├── dayId
├── createdAt
├── updatedAt
│
├── Day (belongs to)
├── Notes[]
└── Todos[]

Note
├── id (uuid)
├── content
├── order
├── timeBlockId
├── createdAt
├── updatedAt
│
└── TimeBlock (belongs to)

Todo
├── id (uuid)
├── title
├── isCompleted
├── deadline (optional)
├── order
├── userId
├── dayId (optional)
├── timeBlockId (optional)
├── createdAt
├── updatedAt
│
├── User (belongs to)
├── Day (optional, belongs to)
└── TimeBlock (optional, belongs to)

Event
├── id (uuid)
├── title
├── date
├── color (optional)
├── isRecurring
├── recurrenceType (NONE, DAILY, WEEKLY, MONTHLY, YEARLY)
├── userId
├── createdAt
├── updatedAt
│
└── User (belongs to)
```

### Key Relationships
- A Todo belongs to a User and can optionally belong to either a Day (general todo) or a TimeBlock (block-specific todo)
- A Day is considered "completed" when all its TimeBlocks are marked as completed
- Streak is calculated based on consecutive days completed

## Design Guidelines

- **Style:** Minimalist/abstract
- **Colors:** White, black, gray with pastel accents
- **Accent Colors:**
  - Blue: `#A5D8FF`
  - Green: `#B2F2BB`
  - Yellow: `#FFEC99`
  - Pink: `#FCC2D7`
  - Purple: `#D0BFFF`

Day and Week time blocks use a soft background derived from their saved color, with a solid left accent. Day event cards, event badges in Week and Month, dashboard schedule rows, and dashboard upcoming event rows share this treatment. Day cards use a 6 px accent; compact calendar items and dashboard rows use 3 px. Completing a block preserves its color and marks its title as completed. Upcoming event date tiles use a neutral, theme-aware background. Month time block indicators remain solid dots, and dashboard statistics widgets retain their existing styling.

The palette remains unchanged, including custom colors. The full preset palette and fallback live in `src/types/calendar.ts`. See [Calendar Color Surfaces](docs/UI_RESPONSIVENESS_STANDARDS.md#calendar-color-surfaces) for implementation values and [Time Block Ordering](README.md#time-block-ordering) for differences between Day, Week, Month, and the dashboard. Todos and notes continue to support drag-and-drop reordering.

## Project Structure

### Backend
```
kairo-backend/
├── src/
│   ├── auth/           # Authentication module
│   ├── users/          # Users module
│   ├── days/           # Days module
│   ├── time-blocks/    # Time blocks module
│   ├── todos/          # Todos module
│   ├── events/         # Events module
│   ├── notes/          # Notes module
│   ├── prisma/         # Prisma service
│   ├── common/         # Shared guards, decorators, filters
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   └── schema.prisma
├── docker-compose.yml
└── .github/workflows/ci.yml
```

### Frontend
```
kairo-frontend/
├── src/
│   ├── components/
│   │   └── ui/         # shadcn/ui components
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   ├── context/
│   ├── lib/
│   ├── types/
│   └── App.tsx
└── .github/workflows/ci.yml
```

## Roadmap

The following phases record the original project plan. Their checkboxes are not a current implementation or release-status checklist; consult the frontend README and source for present behavior.

### Phase 0: Setup ✅
- [x] Backend project setup (NestJS, Prisma, Docker)
- [x] Frontend project setup (React, Vite, Tailwind)
- [x] GitHub repositories created
- [x] CI/CD pipelines configured
- [x] Git workflow established

### Phase 1: Authentication (1 week)
**Backend:**
- [ ] User model in Prisma
- [ ] Auth module: register, login, refresh token
- [ ] JWT guards for protected routes
- [ ] Basic auth tests

**Frontend:**
- [ ] Login page
- [ ] Register page
- [ ] Auth context implementation
- [ ] Protected routes with React Router
- [ ] Token handling with Axios interceptor

**Deliverable:** Working registration and login flow with protected dashboard.

### Phase 2: Core - Routines and Calendar (2 weeks)
**Backend (Week 1):**
- [ ] Day, TimeBlock, Note models
- [ ] Full CRUD for days and time blocks
- [ ] Calendar view endpoint (routines by date range)
- [ ] Validations with class-validator

**Frontend (Week 2):**
- [ ] Calendar view (monthly, weekly, daily)
- [ ] Create/edit/delete time blocks
- [ ] Time block visualization
- [ ] Loading, error, and empty states

**Deliverable:** Functional calendar with time block management.

### Phase 3: Core - Todos (1 week)
**Backend:**
- [ ] Todo model with relationships
- [ ] CRUD for todos
- [ ] Mark as completed
- [ ] Reordering support

**Frontend:**
- [ ] Todo list view
- [ ] Create/edit/delete todos
- [ ] Mark as completed
- [ ] Drag & drop for reordering
- [ ] Move todos between time blocks

**Deliverable:** Integrated todo system with calendar.

### Phase 4: Events (1 week)
**Backend:**
- [ ] Event model with recurrence
- [ ] CRUD for events
- [ ] Recurrence logic

**Frontend:**
- [ ] Event creation/editing
- [ ] Display events on calendar
- [ ] Recurrence UI

**Deliverable:** Event system integrated with calendar views.

### Phase 5: Statistics (3-4 days)
**Backend:**
- [ ] Streak calculation logic
- [ ] Completion percentage endpoint

**Frontend:**
- [ ] Statistics dashboard
- [ ] Streak display
- [ ] Completion charts

**Deliverable:** Statistics view with streak tracking.

### Phase 6: Polish and UX (1 week)
- [ ] Dashboard with daily summary
- [ ] Filters and search
- [ ] Fully responsive design
- [ ] Dark mode
- [ ] Toast notifications
- [ ] Loading skeletons
- [ ] Keyboard shortcuts
- [ ] Drag & drop improvements

### Phase 7: Testing and Documentation (1 week)
**Testing:**
- [ ] Backend e2e tests with Supertest
- [ ] Frontend component tests with Testing Library
- [ ] 60-70% coverage on core logic

**Documentation:**
- [ ] Professional README for both repos
- [ ] Architecture decisions documented
- [ ] API documented with Swagger

### Phase 8: Deploy and CI/CD (2-3 days)
- [ ] Backend deployed to Render
- [ ] Database on Neon
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] Auto-deploy on push to main
- [ ] Cron job to prevent cold starts
- [ ] End-to-end production testing

### Phase 9: Portfolio Ready (2-3 days)
- [ ] Demo GIF/video
- [ ] Links on LinkedIn and resume
- [ ] Talking points prepared
- [ ] Optional: blog post about technical challenges

## Timeline

Estimated total: 6-8 weeks (part-time)

## Repositories

- **Backend:** https://github.com/[USER]/kairo-backend
- **Frontend:** https://github.com/[USER]/kairo-frontend

## Local Development

### Prerequisites
- Node.js 22+
- pnpm
- Docker

### Backend
```bash
cd kairo-backend
pnpm install
docker compose up -d
pnpm prisma migrate dev
pnpm start:dev
```

### Frontend
```bash
cd kairo-frontend
pnpm install
pnpm dev
```
