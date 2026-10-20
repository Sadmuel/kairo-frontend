import { useRef, useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, userEvent } from '@/test/test-utils';
import { CollapsibleContent } from '@/components/ui/collapsible-content';
import { TodoForm } from '@/components/todos/todo-form';

function PlannerForm() {
  const [outerOpen, setOuterOpen] = useState(true);
  const [innerOpen, setInnerOpen] = useState(true);
  const [showPlanner, setShowPlanner] = useState(true);
  const outerTrigger = useRef<HTMLButtonElement>(null);
  const innerTrigger = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={(event) => {
          event.currentTarget.focus();
          setShowPlanner(false);
        }}
      >
        Leave planner
      </button>
      {showPlanner && (
        <>
          <button
            ref={outerTrigger}
            type="button"
            aria-expanded={outerOpen}
            aria-controls="test-time-block"
            onClick={(event) => {
              event.currentTarget.focus();
              setOuterOpen(!outerOpen);
            }}
          >
            Toggle time block
          </button>
          <CollapsibleContent id="test-time-block" open={outerOpen} triggerRef={outerTrigger}>
            <button
              ref={innerTrigger}
              type="button"
              aria-expanded={innerOpen}
              aria-controls="test-todos"
              onClick={(event) => {
                event.currentTarget.focus();
                setInnerOpen(!innerOpen);
              }}
            >
              Toggle todos
            </button>
            <CollapsibleContent id="test-todos" open={innerOpen} triggerRef={innerTrigger}>
              <TodoForm timeBlockId="test-block" />
            </CollapsibleContent>
          </CollapsibleContent>
        </>
      )}
    </>
  );
}

// Radix queues its unmount autofocus for the next task.
async function flushCloseAutoFocus() {
  await act(async () => {
    await new Promise<void>((resolve) => window.setTimeout(resolve, 0));
  });
}

describe('TodoForm inside collapsible content', () => {
  let motionStyles: HTMLStyleElement;

  beforeEach(() => {
    // jsdom has no layout observer; leave the real Popover and focus scope intact.
    vi.stubGlobal('ResizeObserver', class {
      observe() {}
      unobserve() {}
      disconnect() {}
    });
    motionStyles = document.createElement('style');
    motionStyles.textContent = `
      .collapsible-content {
        transition-property: grid-template-rows;
        transition-duration: 1s;
      }
    `;
    document.head.append(motionStyles);
  });

  afterEach(() => {
    cleanup();
    motionStyles.remove();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('keeps the Inbox deadline popover and its normal Escape focus behavior', async () => {
    const user = userEvent.setup();
    render(<TodoForm />, { withAuth: false, withTheme: false });

    await user.click(screen.getByRole('button', { name: 'Add todo' }));
    await user.type(screen.getByPlaceholderText('Add a todo...'), 'Inbox draft');
    const trigger = screen.getByRole('button', { name: 'Set todo deadline' });
    await user.click(trigger);
    expect(screen.getByLabelText('Deadline')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await flushCloseAutoFocus();

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(screen.getByPlaceholderText('Add a todo...')).toHaveValue('Inbox draft');
  });

  it.each(['Toggle todos', 'Toggle time block'])(
    'hides the portal immediately on %s and does not reopen it during a reversal',
    async (toggleName) => {
      // Give Radix a detectable exit animation. Without hidden/inert, its portal
      // would remain present while the enclosing panel is already closing.
      motionStyles.textContent += `
        [role="dialog"][data-state="open"] { animation-name: deadline-enter; }
        [role="dialog"][data-state="closed"] { animation-name: deadline-exit; }
      `;
      const user = userEvent.setup();
      render(<PlannerForm />, { withAuth: false, withTheme: false });
      await user.click(screen.getByRole('button', { name: 'Add todo' }));
      const title = screen.getByPlaceholderText('Add a todo...');
      await user.type(title, 'Keep during exit');
      await user.click(screen.getByRole('button', { name: 'Set todo deadline' }));
      fireEvent.change(screen.getByLabelText('Deadline'), { target: { value: '2026-10-22' } });
      const portal = screen.getByRole('dialog');
      const toggle = screen.getByRole('button', { name: toggleName });

      // A click alone exercises the collapse handler without dismissing the
      // popover first through an unrelated pointer-down-outside interaction.
      fireEvent.click(toggle);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(!portal.isConnected || (portal.hidden && portal.hasAttribute('inert'))).toBe(true);
      expect(title).toBeInTheDocument();
      expect(title).toHaveValue('Keep during exit');

      fireEvent.click(toggle);
      await flushCloseAutoFocus();

      expect(screen.getByPlaceholderText('Add a todo...')).toBe(title);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(toggle).toHaveFocus();

      // A new explicit open clears the ancestor-close marker, so ordinary
      // popover focus restoration still works after the interrupted collapse.
      motionStyles.textContent = '.collapsible-content { transition-duration: 1s; }';
      const deadlineTrigger = screen.getByRole('button', { name: 'Set todo deadline' });
      await user.click(deadlineTrigger);
      expect(screen.getByLabelText('Deadline')).toHaveValue('2026-10-22');
      await user.keyboard('{Escape}');
      await flushCloseAutoFocus();
      expect(deadlineTrigger).toHaveFocus();
    },
  );

  it('removes the portal immediately and keeps focus visible with reduced motion', async () => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
      ...media,
      media: query,
      matches: query === '(prefers-reduced-motion: reduce)',
    }));
    const user = userEvent.setup();
    render(<PlannerForm />, { withAuth: false, withTheme: false });
    await user.click(screen.getByRole('button', { name: 'Add todo' }));
    await user.click(screen.getByRole('button', { name: 'Set todo deadline' }));
    const toggle = screen.getByRole('button', { name: 'Toggle time block' });

    fireEvent.click(toggle);
    await flushCloseAutoFocus();

    expect(screen.queryByRole('dialog', { hidden: true })).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Add a todo...')).not.toBeInTheDocument();
    expect(toggle).toHaveFocus();
  });

  it('does not restore focus to the deadline trigger when navigation unmounts the form', async () => {
    const user = userEvent.setup();
    render(<PlannerForm />, { withAuth: false, withTheme: false });
    await user.click(screen.getByRole('button', { name: 'Add todo' }));
    const deadlineTrigger = screen.getByRole('button', { name: 'Set todo deadline' });
    await user.click(deadlineTrigger);
    const leave = screen.getByRole('button', { name: 'Leave planner' });

    fireEvent.click(leave);
    await flushCloseAutoFocus();

    expect(deadlineTrigger).not.toBeInTheDocument();
    expect(screen.queryByRole('dialog', { hidden: true })).not.toBeInTheDocument();
    expect(leave).toHaveFocus();
  });
});
