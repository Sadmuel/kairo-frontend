import { Outlet } from 'react-router-dom';
import { Navbar } from './navbar';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Outlet />
    </div>
  );
}
