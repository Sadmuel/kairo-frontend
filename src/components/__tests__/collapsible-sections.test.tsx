import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { StickyNote } from 'lucide-react';
import { fireEvent, render, screen, userEvent, waitFor } from '@/test/test-utils';
import { mockNote, mockTimeBlock, mockTodo } from '@/test/mocks/handlers';
import { server } from '@/test/mocks/server';
import { CollapsibleSection } from '../ui/collapsible-section';
import { TimeBlockCard } from '../time-blocks/time-block-card';
import { DayTodoSection } from '../todos/day-todo-section';

const renderOptions = { withAuth: false, withTheme: false };

beforeEach(() => {
  // Integration contracts settle immediately; transition timing is covered by
  // the primitive tests and browser checks, not jsdom layout.
  vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
    matches: query === '(prefers-reduced-motion: reduce)',
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
});

afterEach(() => vi.restoreAllMocks());

describe('CollapsibleSection integration', () => {
  it('keeps its label, badge and controlled region while closing returns focus to a non-submit trigger', () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <CollapsibleSection icon={StickyNote} label="Notes" badge="2" contentId="example-notes">
          <input aria-label="Note draft" defaultValue="Unsaved note" />
        </CollapsibleSection>
      </form>,
      renderOptions
    );
    const trigger = screen.getByRole('button', { name: /^Notes\s*\(2\)$/ });
    const region = document.getElementById(trigger.getAttribute('aria-controls')!);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('type', 'button');
    expect(region).toContainElement(screen.getByRole('textbox', { name: 'Note draft' }));
    screen.getByRole('textbox', { name: 'Note draft' }).focus();

    // fireEvent does not focus the clicked control; the consumer must do so.
    fireEvent.click(trigger);

    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute('aria-hidden', 'true');
    expect(region).toHaveAttribute('inert');
    expect(screen.queryByRole('textbox', { name: 'Note draft' })).not.toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('honors defaultExpanded=false without mounting children before the first opening', async () => {
    const user = userEvent.setup();
    render(
      <CollapsibleSection icon={StickyNote} label="Notes" contentId="lazy-notes" defaultExpanded={false}>
        <input aria-label="Lazy note" />
      </CollapsibleSection>,
      renderOptions
    );
    const trigger = screen.getByRole('button', { name: 'Notes' });

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(document.getElementById('lazy-notes')).toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: 'Lazy note' })).not.toBeInTheDocument();

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('textbox', { name: 'Lazy note' })).toBeInTheDocument();
  });
});

describe('TimeBlockCard expansion integration', () => {
  it('keeps details initially lazy and synchronizes preview visibility with current counts', async () => {
    const user = userEvent.setup();
    const emptyBlock = { ...mockTimeBlock, notes: [], todos: [] };
    const { rerender } = render(<TimeBlockCard timeBlock={emptyBlock} dayId="day-1" />, renderOptions);
    const trigger = screen.getByRole('button', { name: 'Expand details' });
    const contentId = trigger.getAttribute('aria-controls');
    const region = document.getElementById(contentId!);
    const preview = document.getElementById(`time-block-preview-${emptyBlock.id}`);

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute('inert');
    expect(screen.queryByRole('button', { name: /^Todos/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Notes/ })).not.toBeInTheDocument();
    expect(preview).toHaveAttribute('aria-hidden', 'true');
    expect(preview).not.toHaveTextContent(/\S/);

    rerender(<TimeBlockCard timeBlock={mockTimeBlock} dayId="day-1" />);
    expect(screen.getByText('1 note')).toBeInTheDocument();
    expect(preview).toHaveAttribute('aria-hidden', 'false');

    const populatedBlock = {
      ...mockTimeBlock,
      notes: [mockNote, { ...mockNote, id: 'note-2' }],
      todos: [mockTodo, { ...mockTodo, id: 'todo-2' }],
    };
    rerender(<TimeBlockCard timeBlock={populatedBlock} dayId="day-1" />);
    expect(screen.getByText('2 notes, 2 todos')).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-controls', contentId);

    await user.click(trigger);

    expect(trigger).toHaveAccessibleName('Collapse details');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(region).not.toHaveAttribute('inert');
    expect(preview).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByText('2 notes, 2 todos')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Todos\s*\(0\/2\)$/ })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: /^Notes\s*\(2\)$/ })).toHaveAttribute('aria-expanded', 'true');

    await user.click(trigger);

    expect(trigger).toHaveAccessibleName('Expand details');
    expect(screen.getByText('2 notes, 2 todos')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Notes/ })).not.toBeInTheDocument();
  });

  it('resets a note draft after a complete section close and restores nested defaults after closing its block', async () => {
    const user = userEvent.setup();
    render(<TimeBlockCard timeBlock={mockTimeBlock} dayId="day-1" />, renderOptions);
    await user.click(screen.getByRole('button', { name: 'Expand details' }));
    const notesTrigger = screen.getByRole('button', { name: /^Notes\s*\(1\)$/ });
    const todosTrigger = screen.getByRole('button', { name: 'Todos' });
    await user.click(screen.getByRole('button', { name: 'Add note' }));
    await user.type(screen.getByPlaceholderText('Add a note...'), 'Unsaved note');

    fireEvent.click(notesTrigger);

    expect(notesTrigger).toHaveFocus();
    expect(screen.queryByPlaceholderText('Add a note...')).not.toBeInTheDocument();
    expect(todosTrigger).toHaveAttribute('aria-expanded', 'true');

    await user.click(notesTrigger);
    await user.click(screen.getByRole('button', { name: 'Add note' }));
    expect(screen.getByPlaceholderText('Add a note...')).toHaveValue('');
    await user.click(notesTrigger);
    await user.click(screen.getByRole('button', { name: 'Collapse details' }));
    await user.click(screen.getByRole('button', { name: 'Expand details' }));

    expect(screen.getByRole('button', { name: /^Notes\s*\(1\)$/ })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Todos' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Add note' })).toBeInTheDocument();
  });
});

describe('DayTodoSection expansion integration', () => {
  it('starts open, keeps the loading branch, and preserves collapse state when dayId becomes available', async () => {
    const user = userEvent.setup();
    let releaseTodos!: () => void;
    const pendingTodos = new Promise<void>((resolve) => { releaseTodos = resolve; });
    server.use(http.get('http://localhost:3000/todos', async () => {
      await pendingTodos;
      return HttpResponse.json([mockTodo]);
    }));
    const ensureDayId = vi.fn().mockResolvedValue('day-1');
    const { rerender } = render(<DayTodoSection ensureDayId={ensureDayId} />, renderOptions);
    const trigger = screen.getByRole('button', { name: 'Day Tasks' });

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Add todo' })).toBeInTheDocument();
    await user.click(trigger);
    rerender(<DayTodoSection dayId="day-1" ensureDayId={ensureDayId} />);

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(document.getElementById(trigger.getAttribute('aria-controls')!)).toHaveAttribute('inert');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.queryByRole('button', { name: 'Add todo' })).not.toBeInTheDocument();

    releaseTodos();

    expect(await screen.findByText(mockTodo.title)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Day Tasks\s*\(0\/1\)$/ })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Add todo' })).toBeInTheDocument();
    expect(ensureDayId).not.toHaveBeenCalled();
  });

  it('still creates a task after resolving a new day and resets the draft after a complete close', async () => {
    const user = userEvent.setup();
    const ensureDayId = vi.fn().mockResolvedValue('created-day');
    const createTodo = vi.fn();
    server.use(http.post('http://localhost:3000/todos', async ({ request }) => {
      const body = await request.json();
      createTodo(body);
      return HttpResponse.json({ ...mockTodo, id: 'created-todo', dayId: 'created-day' }, { status: 201 });
    }));
    render(<DayTodoSection ensureDayId={ensureDayId} />, renderOptions);
    const trigger = screen.getByRole('button', { name: 'Day Tasks' });
    await user.click(screen.getByRole('button', { name: 'Add todo' }));
    await user.type(screen.getByPlaceholderText('Add a todo...'), 'Discard this draft');

    fireEvent.click(trigger);

    expect(trigger).toHaveFocus();
    expect(screen.queryByPlaceholderText('Add a todo...')).not.toBeInTheDocument();
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'Add todo' }));
    expect(screen.getByPlaceholderText('Add a todo...')).toHaveValue('');
    await user.type(screen.getByPlaceholderText('Add a todo...'), 'Plan tomorrow');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    await waitFor(() => expect(createTodo).toHaveBeenCalledExactlyOnceWith({ title: 'Plan tomorrow', dayId: 'created-day' }));
    expect(ensureDayId).toHaveBeenCalledExactlyOnceWith();
    expect(await screen.findByRole('button', { name: 'Add todo' })).toBeInTheDocument();
  });
});
