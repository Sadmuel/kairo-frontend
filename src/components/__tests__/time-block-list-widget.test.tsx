import { describe, expect, it } from 'vitest';
import { render, screen } from '@/test/test-utils';
import type { DashboardTimeBlock, DashboardTodayDetail } from '@/types/dashboard';
import { TimeBlockListWidget } from '../dashboard/time-block-list-widget';

function block(id: string, startTime: string, order: number): DashboardTimeBlock {
  return {
    id,
    name: `Block ${id}`,
    startTime,
    endTime: '23:59',
    order,
    isCompleted: false,
    color: null,
    notes: [],
    todos: [],
  };
}

function visibleBlockNames() {
  return screen.getAllByText(/^Block /).map((element) => element.textContent);
}

describe('TimeBlockListWidget', () => {
  it('shows the first five chronological blocks with numeric order ties without mutating input', () => {
    const data: DashboardTodayDetail = {
      id: 'today',
      date: '2026-10-13',
      isCompleted: false,
      todos: [],
      timeBlocks: [
        block('evening', '18:00', 0),
        block('tie-later', '09:00', 10),
        block('noon', '12:00', 1),
        block('morning', '08:00', 9),
        block('late-night', '23:30', 3),
        block('tie-first', '09:00', 2),
        block('midnight', '00:00', 20),
      ],
    };
    const originalBlocks = data.timeBlocks.map((item) => ({ ...item }));
    data.timeBlocks.forEach(Object.freeze);
    Object.freeze(data.timeBlocks);

    const { rerender } = render(<TimeBlockListWidget data={data} />, {
      withAuth: false,
      withTheme: false,
    });

    expect(visibleBlockNames()).toEqual([
      'Block midnight',
      'Block morning',
      'Block tie-first',
      'Block tie-later',
      'Block noon',
    ]);
    expect(screen.getByText('+2 more time blocks')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View all' })).toHaveAttribute('href', '/calendar');
    expect(data.timeBlocks).toEqual(originalBlocks);

    rerender(
      <TimeBlockListWidget
        data={{
          ...data,
          timeBlocks: data.timeBlocks.map((item) =>
            item.id === 'late-night' ? { ...item, startTime: '00:30' } : item
          ),
        }}
      />
    );

    expect(visibleBlockNames()).toEqual([
      'Block midnight',
      'Block late-night',
      'Block morning',
      'Block tie-first',
      'Block tie-later',
    ]);
    expect(screen.getByText('+2 more time blocks')).toBeInTheDocument();
    expect(data.timeBlocks).toEqual(originalBlocks);
  });
});
