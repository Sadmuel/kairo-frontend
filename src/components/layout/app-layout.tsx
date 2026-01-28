import { Outlet } from 'react-router-dom';
import { Navbar } from './navbar';
import { DemoBanner } from '@/components/demo-banner';
import { useGlobalKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';

export function AppLayout() {
  // Enable global keyboard shortcuts
  useGlobalKeyboardShortcuts();

  return (
    <div className="min-h-screen bg-background">
      <DemoBanner />
      <Navbar />
      <Outlet />
    </div>
  );
}
