import { StrictMode, useRef } from 'react';
import type { ReactNode } from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CollapsibleContent } from '../ui/collapsible-content';

let reduced = false;
let mediaListeners: Set<() => void>;
let style: HTMLStyleElement;

function Harness({ open, children }: { open: boolean; children?: ReactNode }) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button ref={triggerRef}>Toggle</button>
      <CollapsibleContent id="details" open={open} triggerRef={triggerRef}>
        {children ?? <input aria-label="Draft" defaultValue="" />}
      </CollapsibleContent>
      <button>Outside</button>
    </>
  );
}

function finishTransition(target: Element, propertyName = 'grid-template-rows', timeStamp?: number) {
  const event = new Event('transitionend', { bubbles: true });
  Object.defineProperty(event, 'propertyName', { value: propertyName });
  if (timeStamp !== undefined) Object.defineProperty(event, 'timeStamp', { value: timeStamp });
  fireEvent(target, event);
}

function advance(ms: number) {
  act(() => vi.advanceTimersByTime(ms));
}

function changeReducedMotion(value: boolean) {
  act(() => {
    reduced = value;
    mediaListeners.forEach(listener => listener());
  });
}

beforeEach(() => {
  vi.useFakeTimers();
  reduced = false;
  mediaListeners = new Set();
  vi.spyOn(window, 'matchMedia').mockImplementation(query => ({
    media: query,
    get matches() { return reduced; },
    addEventListener: (_event: string, listener: EventListenerOrEventListenerObject | null) => {
      if (typeof listener === 'function') mediaListeners.add(listener as () => void);
    },
    removeEventListener: (_event: string, listener: EventListenerOrEventListenerObject | null) => {
      if (typeof listener === 'function') mediaListeners.delete(listener as () => void);
    },
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
    onchange: null,
  }) as MediaQueryList);
  style = document.createElement('style');
  style.textContent = '.collapsible-content { transition-duration: 220ms; }';
  document.head.append(style);
});

afterEach(() => {
  cleanup();
  style.remove();
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('CollapsibleContent', () => {
  it('keeps a closed controls target without mounting children or starting timers', () => {
    render(<Harness open={false} />);
    expect(document.getElementById('details')).toHaveAttribute('inert');
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('renders initially open content at rest without an entrance transition', () => {
    render(<Harness open />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(document.getElementById('details')).toHaveAttribute('data-state', 'open');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('mounts before opening, preserves a draft through reversal, and resets it after a full close', () => {
    const { rerender } = render(<Harness open={false} />);
    rerender(<Harness open />);
    const panel = document.getElementById('details')!;
    const input = screen.getByRole('textbox');
    expect(panel).toHaveAttribute('data-expanded', 'false');
    advance(40);
    expect(panel).toHaveAttribute('data-expanded', 'true');
    finishTransition(panel);
    fireEvent.change(input, { target: { value: 'Keep this until closed' } });

    rerender(<Harness open={false} />);
    expect(input).toBeInTheDocument();
    expect(panel).toHaveAttribute('inert');
    advance(100);
    rerender(<Harness open />);
    advance(180); // The previous closing fallback would have fired by now.
    expect(screen.getByRole('textbox')).toHaveValue('Keep this until closed');
    finishTransition(panel);

    rerender(<Harness open={false} />);
    finishTransition(panel);
    expect(input).not.toBeInTheDocument();
    expect(panel).toBeInTheDocument();
    rerender(<Harness open />);
    advance(40);
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('cancels a close before the opening frames and cannot reopen from a stale callback', () => {
    const { rerender } = render(<Harness open={false} />);
    rerender(<Harness open />);
    rerender(<Harness open={false} />);
    advance(500);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(document.getElementById('details')).toHaveAttribute('data-expanded', 'false');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('ignores child/unrelated/stale transition events and uses a fallback when no end arrives', () => {
    const { rerender } = render(<Harness open />);
    const input = screen.getByRole('textbox');
    advance(100);
    rerender(<Harness open={false} />);
    const panel = document.getElementById('details')!;
    finishTransition(input);
    finishTransition(panel, 'opacity');
    finishTransition(panel, 'grid-template-rows', 0);
    fireEvent(panel, new Event('transitioncancel', { bubbles: true }));
    expect(input).toBeInTheDocument();
    advance(269);
    expect(input).toBeInTheDocument();
    advance(1);
    expect(input).not.toBeInTheDocument();
  });

  it('settles empty content and CSS-disabled transitions without depending on an end event', () => {
    const { rerender } = render(<Harness open={false}>{null}</Harness>);
    rerender(<Harness open>{<span />}</Harness>);
    advance(40);
    advance(280);
    const panel = document.getElementById('details')!;
    expect(panel).toHaveAttribute('data-state', 'open');
    style.textContent = '.collapsible-content { transition-duration: 0s; }';
    rerender(<Harness open={false} />);
    advance(0);
    expect(panel).toHaveAttribute('data-state', 'closed');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('finishes immediately when reduced motion is active or enabled during a transition', () => {
    reduced = true;
    const { rerender } = render(<Harness open={false} />);
    rerender(<Harness open />);
    expect(document.getElementById('details')).toHaveAttribute('data-state', 'open');
    rerender(<Harness open={false} />);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(vi.getTimerCount()).toBe(0);

    changeReducedMotion(false);
    rerender(<Harness open />);
    advance(40);
    changeReducedMotion(true);
    expect(document.getElementById('details')).toHaveAttribute('data-state', 'open');
    expect(vi.getTimerCount()).toBe(0);
    changeReducedMotion(false);
    rerender(<Harness open={false} />);
    changeReducedMotion(true);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each([false, true])('returns hidden focus to its trigger without stealing outside focus (reduce=%s)', reduce => {
    reduced = reduce;
    const { rerender } = render(<Harness open />);
    screen.getByRole('textbox').focus();
    rerender(<Harness open={false} />);
    expect(screen.getByRole('button', { name: 'Toggle' })).toHaveFocus();
    advance(300);
    rerender(<Harness open />);
    advance(40);
    advance(280);
    screen.getByRole('button', { name: 'Outside' }).focus();
    rerender(<Harness open={false} />);
    expect(screen.getByRole('button', { name: 'Outside' })).toHaveFocus();
  });

  it('makes nested content inert without starting another size transition when its ancestor closes', () => {
    const child = (
      <CollapsibleContent id="nested" open>
        <input aria-label="Nested draft" />
      </CollapsibleContent>
    );
    const { rerender } = render(<Harness open>{child}</Harness>);
    const nested = document.getElementById('nested')!;
    rerender(<Harness open={false}>{child}</Harness>);
    expect(nested).toHaveAttribute('inert');
    expect(nested).toHaveAttribute('data-state', 'open');
    advance(300);
    expect(nested).not.toBeInTheDocument();
  });

  it('cleans up frames, timers and media listeners under Strict Mode', () => {
    const { rerender, unmount } = render(<StrictMode><Harness open={false} /></StrictMode>);
    rerender(<StrictMode><Harness open /></StrictMode>);
    advance(40);
    expect(mediaListeners.size).toBe(1);
    unmount();
    expect(mediaListeners.size).toBe(0);
    expect(vi.getTimerCount()).toBe(0);
    advance(500);
  });
});
