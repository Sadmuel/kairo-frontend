import { CalendarHeader, CalendarGrid } from '@/components/calendar';
import { useDocumentTitle } from '@/hooks/use-document-title';

export default function CalendarPage() {
  useDocumentTitle('Calendar');
  return (
    <main className="container mx-auto max-w-6xl px-3 py-4 sm:px-4 sm:py-6">
      <CalendarHeader />
      <CalendarGrid />
    </main>
  );
}
