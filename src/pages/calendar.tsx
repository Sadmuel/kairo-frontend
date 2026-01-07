import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CalendarHeader, CalendarGrid } from '@/components/calendar';
import { Button } from '@/components/ui/button';

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Page header with navigation */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 max-w-6xl items-center gap-4 px-3 sm:px-4">
          <Button variant="ghost" size="icon" asChild className="h-10 w-10 sm:h-9 sm:w-9">
            <Link to="/dashboard">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to Dashboard</span>
            </Link>
          </Button>
          <h1 className="text-lg font-semibold sm:text-xl">Calendar</h1>
        </div>
      </header>

      {/* Calendar content */}
      <main className="container mx-auto max-w-6xl px-3 py-4 sm:px-4 sm:py-6">
        <CalendarHeader />
        <CalendarGrid />
      </main>
    </div>
  );
}
