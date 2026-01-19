import { CalendarHeader, CalendarGrid } from '@/components/calendar';

export default function CalendarPage() {
  return (
    <main className="container mx-auto max-w-6xl px-3 py-4 sm:px-4 sm:py-6">
      <CalendarHeader />
      <CalendarGrid />
    </main>
  );
}
