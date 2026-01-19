import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

type ShortcutHandler = () => void;

interface ShortcutConfig {
  key: string;
  handler: ShortcutHandler;
  description: string;
  context?: 'global' | 'day-view';
  requiresNoModifier?: boolean;
}

// Check if user is typing in an input field
function isTypingInInput(): boolean {
  const activeElement = document.activeElement;
  if (!activeElement) return false;

  const tagName = activeElement.tagName.toLowerCase();
  if (tagName === 'input' || tagName === 'textarea') return true;

  // Check for contenteditable
  if (activeElement.getAttribute('contenteditable') === 'true') return true;

  return false;
}

// Global keyboard shortcuts hook
export function useGlobalKeyboardShortcuts() {
  const navigate = useNavigate();

  const goToToday = useCallback(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    navigate(`/calendar?date=${today}&view=day`);
  }, [navigate]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip if user is typing in an input
      if (isTypingInInput()) return;

      // Skip if any modifier key is pressed (except for specific shortcuts)
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      // T - Go to today
      if (event.key === 't' || event.key === 'T') {
        event.preventDefault();
        goToToday();
        return;
      }

      // ? - Show help (optional future feature)
      // Could open a shortcuts help modal
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToToday]);

  return { goToToday };
}

/**
 * Custom hook for registering component-specific keyboard shortcuts.
 *
 * IMPORTANT: The handler function should be memoized with useCallback to prevent
 * unnecessary event listener re-registration on every render.
 *
 * @example
 * const handleShortcut = useCallback(() => {
 *   // do something
 * }, [dependencies]);
 * useKeyboardShortcut('n', handleShortcut);
 */
export function useKeyboardShortcut(
  key: string,
  handler: ShortcutHandler,
  options: {
    enabled?: boolean;
    requiresNoInput?: boolean;
    preventDefault?: boolean;
  } = {}
) {
  const { enabled = true, requiresNoInput = true, preventDefault = true } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip if user is typing and option is set
      if (requiresNoInput && isTypingInInput()) return;

      // Skip if any modifier key is pressed
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key.toLowerCase() === key.toLowerCase()) {
        if (preventDefault) {
          event.preventDefault();
        }
        handler();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, handler, enabled, requiresNoInput, preventDefault]);
}

// Escape key hook - useful for closing modals
export function useEscapeKey(handler: ShortcutHandler, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handler();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handler, enabled]);
}

// Export shortcut definitions for display in help UI
export const KEYBOARD_SHORTCUTS: ShortcutConfig[] = [
  {
    key: 'T',
    handler: () => {},
    description: 'Go to today',
    context: 'global',
  },
  {
    key: 'N',
    handler: () => {},
    description: 'New todo (in day view)',
    context: 'day-view',
  },
  {
    key: 'Escape',
    handler: () => {},
    description: 'Close modal/cancel',
    context: 'global',
  },
];
