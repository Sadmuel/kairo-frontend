import { describe, expect, it } from 'vitest';
import { render, screen, userEvent } from '@/test/test-utils';
import { mockDay, mockTimeBlock } from '@/test/mocks/handlers';
import type { Day, TimeBlock } from '@/types/calendar';
import { TimeBlockList } from '../time-blocks/time-block-list';

const eveningBlock: TimeBlock = {
  ...mockTimeBlock,
  id: 'evening',
  name: 'Evening',
  startTime: '18:00',
  endTime: '19:00',
  order: 0,
};

const morningBlock: TimeBlock = {
  ...mockTimeBlock,
  id: 'morning',
  name: 'Morning',
  startTime: '08:00',
  endTime: '09:00',
  order: 1,
};

function getBlockNames() {
  return screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent);
}

describe('TimeBlockList', () => {
  it('shows blocks chronologically across the day without changing its frozen input', () => {
    const day: Day = {
      ...mockDay,
      timeBlocks: [
        { ...eveningBlock },
        { ...morningBlock },
        { ...mockTimeBlock, id: 'noon', name: 'Noon', startTime: '12:00', endTime: '13:00', order: 2 },
        { ...mockTimeBlock, id: 'late', name: 'Late', startTime: '23:30', endTime: '23:59', order: 3 },
        { ...mockTimeBlock, id: 'midnight', name: 'Midnight', startTime: '00:00', endTime: '00:30', order: 4 },
      ],
    };
    const originalBlocks = day.timeBlocks.map((block) => ({ ...block }));
    day.timeBlocks.forEach(Object.freeze);
    Object.freeze(day.timeBlocks);

    const { rerender } = render(<TimeBlockList day={day} />, {
      withAuth: false,
      withTheme: false,
    });

    expect(getBlockNames()).toEqual(['Midnight', 'Morning', 'Noon', 'Evening', 'Late']);
    expect(day.timeBlocks).toEqual(originalBlocks);

    rerender(<TimeBlockList day={{ ...day }} />);

    expect(getBlockNames()).toEqual(['Midnight', 'Morning', 'Noon', 'Evening', 'Late']);
    expect(day.timeBlocks).toEqual(originalBlocks);
  });

  it('breaks equal start times by order even when end times and names favor the other block', () => {
    const day: Day = {
      ...mockDay,
      timeBlocks: [
        { ...morningBlock, name: 'A short block', startTime: '09:00', endTime: '10:00', order: 8 },
        { ...eveningBlock, name: 'Z long block', startTime: '09:00', endTime: '11:00', order: 3 },
      ],
    };

    render(<TimeBlockList day={day} />, { withAuth: false, withTheme: false });

    expect(getBlockNames()).toEqual(['Z long block', 'A short block']);
  });

  it('repositions added and edited blocks while preserving expanded state by ID', async () => {
    const user = userEvent.setup();
    const day: Day = { ...mockDay, timeBlocks: [eveningBlock, morningBlock] };
    const { rerender } = render(<TimeBlockList day={day} />, {
      withAuth: false,
      withTheme: false,
    });
    await user.click(screen.getAllByRole('button', { name: 'Expand details' })[1]);

    const recurringBlock: TimeBlock = {
      ...mockTimeBlock,
      id: 'recurring',
      name: 'Recurring',
      startTime: '06:00',
      endTime: '07:00',
      order: 2,
      templateId: 'template-1',
    };
    rerender(<TimeBlockList day={{ ...day, timeBlocks: [...day.timeBlocks, recurringBlock] }} />);

    expect(getBlockNames()).toEqual(['Recurring', 'Morning', 'Evening']);

    rerender(
      <TimeBlockList
        day={{
          ...day,
          timeBlocks: [
            { ...eveningBlock, startTime: '05:00', endTime: '06:00' },
            morningBlock,
            recurringBlock,
          ],
        }}
      />
    );

    expect(getBlockNames()).toEqual(['Evening', 'Recurring', 'Morning']);
    expect(
      screen.getAllByRole('button', { name: /^(Expand|Collapse) details$/ })
        .map((button) => button.getAttribute('aria-label'))
    ).toEqual(['Collapse details', 'Expand details', 'Expand details']);
  });

  it('keeps card actions available without a time block drag control', async () => {
    const user = userEvent.setup();
    render(<TimeBlockList day={{ ...mockDay, timeBlocks: [morningBlock] }} />, {
      withAuth: false,
      withTheme: false,
    });

    expect(screen.queryByRole('button', { name: 'Drag to reorder time block' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit time block' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Duplicate time block' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Delete time block' })).toBeEnabled();
    expect(screen.getByRole('checkbox')).toBeEnabled();

    await user.click(screen.getByRole('button', { name: 'Expand details' }));

    expect(screen.getByRole('button', { name: 'Collapse details' })).toBeInTheDocument();
  });

  it('keeps the empty day message', () => {
    render(<TimeBlockList day={{ ...mockDay, timeBlocks: [] }} />, {
      withAuth: false,
      withTheme: false,
    });

    expect(screen.getByText('No time blocks yet. Add one to get started!')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
  });
});
