import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useKeyboardShortcut, useEscapeKey, KEYBOARD_SHORTCUTS } from '../use-keyboard-shortcuts';
import { ReactNode, useCallback } from 'react';

function wrapper({ children }: { children: ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>;
}

describe('useKeyboardShortcut', () => {
  beforeEach(() => {
    vi.spyOn(document, 'activeElement', 'get').mockReturnValue(document.body);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls handler when key is pressed', () => {
    const handler = vi.fn();

    renderHook(
      () => {
        const memoizedHandler = useCallback(handler, []);
        useKeyboardShortcut('n', memoizedHandler);
      },
      { wrapper }
    );

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'n' }));
    });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('is case insensitive', () => {
    const handler = vi.fn();

    renderHook(
      () => {
        const memoizedHandler = useCallback(handler, []);
        useKeyboardShortcut('n', memoizedHandler);
      },
      { wrapper }
    );

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'N' }));
    });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not call handler when disabled', () => {
    const handler = vi.fn();

    renderHook(
      () => {
        const memoizedHandler = useCallback(handler, []);
        useKeyboardShortcut('n', memoizedHandler, { enabled: false });
      },
      { wrapper }
    );

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'n' }));
    });

    expect(handler).not.toHaveBeenCalled();
  });

  it('does not call handler when user is typing in input', () => {
    const handler = vi.fn();
    const input = document.createElement('input');
    vi.spyOn(document, 'activeElement', 'get').mockReturnValue(input);

    renderHook(
      () => {
        const memoizedHandler = useCallback(handler, []);
        useKeyboardShortcut('n', memoizedHandler);
      },
      { wrapper }
    );

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'n' }));
    });

    expect(handler).not.toHaveBeenCalled();
  });

  it('does not call handler when modifier key is pressed', () => {
    const handler = vi.fn();

    renderHook(
      () => {
        const memoizedHandler = useCallback(handler, []);
        useKeyboardShortcut('n', memoizedHandler);
      },
      { wrapper }
    );

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'n', ctrlKey: true }));
    });

    expect(handler).not.toHaveBeenCalled();
  });

  it('prevents default when configured', () => {
    const handler = vi.fn();
    const preventDefault = vi.fn();

    renderHook(
      () => {
        const memoizedHandler = useCallback(handler, []);
        useKeyboardShortcut('n', memoizedHandler, { preventDefault: true });
      },
      { wrapper }
    );

    const event = new KeyboardEvent('keydown', { key: 'n' });
    Object.defineProperty(event, 'preventDefault', { value: preventDefault });

    act(() => {
      window.dispatchEvent(event);
    });

    expect(preventDefault).toHaveBeenCalled();
  });
});

describe('useEscapeKey', () => {
  it('calls handler when Escape is pressed', () => {
    const handler = vi.fn();

    renderHook(
      () => {
        const memoizedHandler = useCallback(handler, []);
        useEscapeKey(memoizedHandler);
      },
      { wrapper }
    );

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not call handler when disabled', () => {
    const handler = vi.fn();

    renderHook(
      () => {
        const memoizedHandler = useCallback(handler, []);
        useEscapeKey(memoizedHandler, false);
      },
      { wrapper }
    );

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });

    expect(handler).not.toHaveBeenCalled();
  });

  it('does not call handler for other keys', () => {
    const handler = vi.fn();

    renderHook(
      () => {
        const memoizedHandler = useCallback(handler, []);
        useEscapeKey(memoizedHandler);
      },
      { wrapper }
    );

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    });

    expect(handler).not.toHaveBeenCalled();
  });
});

describe('KEYBOARD_SHORTCUTS', () => {
  it('exports shortcut definitions', () => {
    expect(KEYBOARD_SHORTCUTS).toBeInstanceOf(Array);
    expect(KEYBOARD_SHORTCUTS.length).toBeGreaterThan(0);
  });

  it('includes T shortcut for go to today', () => {
    const tShortcut = KEYBOARD_SHORTCUTS.find((s) => s.key === 'T');
    expect(tShortcut).toBeDefined();
    expect(tShortcut?.description).toBe('Go to today');
  });

  it('includes Escape shortcut', () => {
    const escShortcut = KEYBOARD_SHORTCUTS.find((s) => s.key === 'Escape');
    expect(escShortcut).toBeDefined();
  });
});
