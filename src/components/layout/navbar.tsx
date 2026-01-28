import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Calendar,
  Inbox,
  BarChart3,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import { KairoLogo } from '@/components/ui/kairo-logo';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, tutorialId: 'nav-dashboard' },
  { to: '/calendar', label: 'Calendar', icon: Calendar, tutorialId: 'nav-calendar' },
  { to: '/todos', label: 'Inbox', icon: Inbox, tutorialId: 'nav-todos' },
  { to: '/stats', label: 'Stats', icon: BarChart3, tutorialId: 'nav-stats' },
];

const themeOptions = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
] as const;

export function Navbar() {
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between px-3 sm:px-4">
        {/* Logo/Brand */}
        <Link
          to="/dashboard"
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <KairoLogo className="h-8 md:h-10" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Button
                key={item.to}
                variant={isActive ? 'secondary' : 'ghost'}
                size="sm"
                asChild
                className={cn(
                  'h-9',
                  isActive && 'bg-secondary'
                )}
                data-tutorial={item.tutorialId}
              >
                <Link to={item.to}>
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            );
          })}
          <div className="ml-2 flex items-center gap-1 pl-2 border-l">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <ThemeIcon className="h-4 w-4" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-32 p-1" align="end">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <Button
                      key={option.value}
                      variant={theme === option.value ? 'secondary' : 'ghost'}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setTheme(option.value)}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {option.label}
                    </Button>
                  );
                })}
              </PopoverContent>
            </Popover>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="h-9"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-10 w-10"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-200 ease-in-out',
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
        // inert prevents keyboard focus and hides from assistive tech when menu is closed
        inert={!isMobileMenuOpen ? true : undefined}
        aria-hidden={!isMobileMenuOpen}
      >
        <nav className="border-t bg-background px-3 py-2">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Button
                  key={item.to}
                  variant={isActive ? 'secondary' : 'ghost'}
                  asChild
                  className={cn(
                    'justify-start h-11',
                    isActive && 'bg-secondary'
                  )}
                  onClick={closeMobileMenu}
                >
                  <Link to={item.to}>
                    <Icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
            <div className="mt-2 pt-2 border-t space-y-1">
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                Theme
              </div>
              <div className="flex gap-1">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <Button
                      key={option.value}
                      variant={theme === option.value ? 'secondary' : 'ghost'}
                      size="sm"
                      className="flex-1"
                      onClick={() => setTheme(option.value)}
                    >
                      <Icon className="mr-1.5 h-4 w-4" />
                      {option.label}
                    </Button>
                  );
                })}
              </div>
            </div>
            <div className="mt-2 pt-2 border-t">
              <Button
                variant="ghost"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="justify-start h-11 w-full text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="mr-3 h-5 w-5" />
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </Button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
