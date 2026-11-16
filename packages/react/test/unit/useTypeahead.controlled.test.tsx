import {act, cleanup, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {useRef, useState} from 'react';
import {afterEach, beforeEach, expect, test, vi} from 'vitest';

import {useFloating, useInteractions, useTypeahead} from '../../src';

const colors = ['Amber', 'Blue', 'Aqua', 'Coral'];

function ControlledSelect({
  initialIndex,
  loadedIndex,
  activeIndex = null,
  labels = colors,
}: {
  initialIndex: number | null;
  loadedIndex: number | null;
  activeIndex?: number | null;
  labels?: Array<string>;
}) {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const {refs, context} = useFloating({open: false});
  const listRef = useRef(labels);
  const typeahead = useTypeahead(context, {
    listRef,
    activeIndex,
    selectedIndex,
    onMatch: setSelectedIndex,
  });
  const {getReferenceProps} = useInteractions([typeahead]);

  return (
    <>
      <button onClick={() => setSelectedIndex(loadedIndex)}>
        Load selection
      </button>
      <button
        ref={refs.setReference}
        {...getReferenceProps({'aria-label': 'Color'})}
      >
        {selectedIndex === null ? 'None' : labels[selectedIndex]}
      </button>
    </>
  );
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.clearAllTimers();
  vi.useRealTimers();
});

test.each([
  {initialIndex: 0, loadedIndex: 2, expected: 'Amber'},
  {initialIndex: 2, loadedIndex: 0, expected: 'Aqua'},
])(
  'starts after selection loaded from $initialIndex to $loadedIndex while closed',
  async ({initialIndex, loadedIndex, expected}) => {
    const user = userEvent.setup({advanceTimers: vi.advanceTimersByTime});
    render(
      <ControlledSelect
        initialIndex={initialIndex}
        loadedIndex={loadedIndex}
      />,
    );

    await user.click(screen.getByRole('button', {name: 'Load selection'}));
    const select = screen.getByRole('button', {name: 'Color'});
    expect(select).toHaveTextContent(colors[loadedIndex]);
    await user.click(select);
    await user.keyboard('a');

    expect(select).toHaveTextContent(expected);
  },
);

test('cycles repeated letters after a closed selection update', async () => {
  const user = userEvent.setup({advanceTimers: vi.advanceTimersByTime});
  render(<ControlledSelect initialIndex={0} loadedIndex={2} />);

  await user.click(screen.getByRole('button', {name: 'Load selection'}));
  const select = screen.getByRole('button', {name: 'Color'});
  await user.click(select);
  await user.keyboard('a');
  expect(select).toHaveTextContent('Amber');
  await user.keyboard('a');
  expect(select).toHaveTextContent('Aqua');
});

test('preserves a multi-character search as selection changes on a match', async () => {
  const user = userEvent.setup({advanceTimers: vi.advanceTimersByTime});
  render(
    <ControlledSelect
      initialIndex={3}
      loadedIndex={0}
      labels={['Apple', 'Apricot', 'Aqua', 'Blue']}
    />,
  );

  await user.click(screen.getByRole('button', {name: 'Load selection'}));
  const select = screen.getByRole('button', {name: 'Color'});
  await user.click(select);
  await user.keyboard('a');
  expect(select).toHaveTextContent('Apricot');
  await user.keyboard('p');
  expect(select).toHaveTextContent('Apricot');
});

test('syncs a closed selection update after a previous search resets', async () => {
  const user = userEvent.setup({advanceTimers: vi.advanceTimersByTime});
  render(<ControlledSelect initialIndex={0} loadedIndex={2} />);

  const select = screen.getByRole('button', {name: 'Color'});
  await user.click(select);
  await user.keyboard('b');
  expect(select).toHaveTextContent('Blue');
  act(() => vi.advanceTimersByTime(750));
  await user.click(screen.getByRole('button', {name: 'Load selection'}));
  await user.click(select);
  await user.keyboard('a');

  expect(select).toHaveTextContent('Amber');
});

test('preserves an active prefix across an external selection update', async () => {
  const user = userEvent.setup({advanceTimers: vi.advanceTimersByTime});
  render(
    <ControlledSelect
      initialIndex={0}
      loadedIndex={2}
      labels={['Apple', 'Apricot', 'Aqua', 'Blue']}
    />,
  );

  const select = screen.getByRole('button', {name: 'Color'});
  await user.click(select);
  await user.keyboard('a');
  expect(select).toHaveTextContent('Apricot');
  await user.click(screen.getByRole('button', {name: 'Load selection'}));
  expect(select).toHaveTextContent('Aqua');
  await user.click(select);
  await user.keyboard('p');

  expect(select).toHaveTextContent('Apricot');
});

test.each([
  {activeIndex: 0, expected: 'Aqua'},
  {activeIndex: null, expected: 'Amber'},
])(
  'falls back to active index $activeIndex when the selection is cleared',
  async ({activeIndex, expected}) => {
    const user = userEvent.setup({advanceTimers: vi.advanceTimersByTime});
    render(
      <ControlledSelect
        initialIndex={2}
        loadedIndex={null}
        activeIndex={activeIndex}
      />,
    );

    await user.click(screen.getByRole('button', {name: 'Load selection'}));
    const select = screen.getByRole('button', {name: 'Color'});
    expect(select).toHaveTextContent('None');
    await user.click(select);
    await user.keyboard('a');

    expect(select).toHaveTextContent(expected);
  },
);
