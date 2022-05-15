import {fireEvent, render, screen, cleanup} from '@testing-library/react';
import {useRef, useState} from 'react';
import {
  useListNavigation,
  useFloating,
  useInteractions,
  useClick,
} from '../../src';
import type {Props} from '../../src/hooks/useListNavigation';

function App(props: Omit<Partial<Props>, 'listRef'>) {
  const [open, setOpen] = useState(false);
  const listRef = useRef<Array<HTMLLIElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState<null | number>(null);
  const {reference, floating, context} = useFloating({
    open,
    onOpenChange: setOpen,
  });
  const {getReferenceProps, getFloatingProps, getItemProps} = useInteractions([
    useClick(context),
    useListNavigation(context, {
      ...props,
      listRef,
      activeIndex,
      onNavigate(index) {
        setActiveIndex(index);
        props.onNavigate?.(index);
      },
    }),
  ]);

  return (
    <>
      <button {...getReferenceProps({ref: reference})} />
      {open && (
        <div role="menu" {...getFloatingProps({ref: floating})}>
          <ul>
            {['one', 'two', 'three'].map((string, index) => (
              <li
                data-testid={`item-${index}`}
                aria-selected={activeIndex === index}
                key={string}
                tabIndex={-1}
                {...getItemProps({
                  ref(node: HTMLLIElement) {
                    listRef.current[index] = node;
                  },
                })}
              >
                {string}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

test('opens on ArrowDown and focuses first item', () => {
  render(<App />);

  fireEvent.keyDown(screen.getByRole('button'), {key: 'ArrowDown'});
  expect(screen.getByRole('menu')).toBeInTheDocument();
  expect(screen.getByTestId('item-0')).toHaveFocus();
  cleanup();
});

test('opens on ArrowUp and focuses last item', async () => {
  render(<App />);

  fireEvent.keyDown(screen.getByRole('button'), {key: 'ArrowUp'});
  expect(screen.queryByRole('menu')).toBeInTheDocument();
  expect(screen.getByTestId('item-2')).toHaveFocus();
  cleanup();
});

test('navigates down on ArrowDown', async () => {
  render(<App />);

  fireEvent.keyDown(screen.getByRole('button'), {key: 'ArrowDown'});
  expect(screen.queryByRole('menu')).toBeInTheDocument();
  expect(screen.getByTestId('item-0')).toHaveFocus();

  fireEvent.keyDown(screen.getByRole('menu'), {key: 'ArrowDown'});
  expect(screen.getByTestId('item-1')).toHaveFocus();

  fireEvent.keyDown(screen.getByRole('menu'), {key: 'ArrowDown'});
  expect(screen.getByTestId('item-2')).toHaveFocus();

  // Reached the end of the list.
  fireEvent.keyDown(screen.getByRole('menu'), {key: 'ArrowDown'});
  expect(screen.getByTestId('item-2')).toHaveFocus();

  cleanup();
});

test('navigates up on ArrowUp', async () => {
  render(<App />);

  fireEvent.keyDown(screen.getByRole('button'), {key: 'ArrowUp'});
  expect(screen.queryByRole('menu')).toBeInTheDocument();
  expect(screen.getByTestId('item-2')).toHaveFocus();

  fireEvent.keyDown(screen.getByRole('menu'), {key: 'ArrowUp'});
  expect(screen.getByTestId('item-1')).toHaveFocus();

  fireEvent.keyDown(screen.getByRole('menu'), {key: 'ArrowUp'});
  expect(screen.getByTestId('item-0')).toHaveFocus();

  // Reached the end of the list.
  fireEvent.keyDown(screen.getByRole('menu'), {key: 'ArrowUp'});
  expect(screen.getByTestId('item-0')).toHaveFocus();

  cleanup();
});

describe('loop', () => {
  test('ArrowDown looping', () => {
    render(<App loop />);

    fireEvent.keyDown(screen.getByRole('button'), {key: 'ArrowDown'});
    expect(screen.queryByRole('menu')).toBeInTheDocument();
    expect(screen.getByTestId('item-0')).toHaveFocus();

    fireEvent.keyDown(screen.getByRole('menu'), {key: 'ArrowDown'});
    expect(screen.getByTestId('item-1')).toHaveFocus();

    fireEvent.keyDown(screen.getByRole('menu'), {key: 'ArrowDown'});
    expect(screen.getByTestId('item-2')).toHaveFocus();

    // Reached the end of the list and loops.
    fireEvent.keyDown(screen.getByRole('menu'), {key: 'ArrowDown'});
    expect(screen.getByTestId('item-0')).toHaveFocus();

    cleanup();
  });

  test('ArrowUp looping', () => {
    render(<App loop />);

    fireEvent.keyDown(screen.getByRole('button'), {key: 'ArrowUp'});
    expect(screen.queryByRole('menu')).toBeInTheDocument();
    expect(screen.getByTestId('item-2')).toHaveFocus();

    fireEvent.keyDown(screen.getByRole('menu'), {key: 'ArrowUp'});
    expect(screen.getByTestId('item-1')).toHaveFocus();

    fireEvent.keyDown(screen.getByRole('menu'), {key: 'ArrowUp'});
    expect(screen.getByTestId('item-0')).toHaveFocus();

    // Reached the end of the list and loops.
    fireEvent.keyDown(screen.getByRole('menu'), {key: 'ArrowUp'});
    expect(screen.getByTestId('item-2')).toHaveFocus();

    cleanup();
  });
});

describe('orientation', () => {
  test('navigates down on ArrowDown', async () => {
    render(<App orientation="horizontal" />);

    fireEvent.keyDown(screen.getByRole('button'), {key: 'ArrowRight'});
    expect(screen.queryByRole('menu')).toBeInTheDocument();
    expect(screen.getByTestId('item-0')).toHaveFocus();

    fireEvent.keyDown(screen.getByRole('menu'), {key: 'ArrowRight'});
    expect(screen.getByTestId('item-1')).toHaveFocus();

    fireEvent.keyDown(screen.getByRole('menu'), {key: 'ArrowRight'});
    expect(screen.getByTestId('item-2')).toHaveFocus();

    // Reached the end of the list.
    fireEvent.keyDown(screen.getByRole('menu'), {key: 'ArrowRight'});
    expect(screen.getByTestId('item-2')).toHaveFocus();

    cleanup();
  });

  test('navigates up on ArrowLeft', async () => {
    render(<App orientation="horizontal" />);

    fireEvent.keyDown(screen.getByRole('button'), {key: 'ArrowLeft'});
    expect(screen.queryByRole('menu')).toBeInTheDocument();
    expect(screen.getByTestId('item-2')).toHaveFocus();

    fireEvent.keyDown(screen.getByRole('menu'), {key: 'ArrowLeft'});
    expect(screen.getByTestId('item-1')).toHaveFocus();

    fireEvent.keyDown(screen.getByRole('menu'), {key: 'ArrowLeft'});
    expect(screen.getByTestId('item-0')).toHaveFocus();

    // Reached the end of the list.
    fireEvent.keyDown(screen.getByRole('menu'), {key: 'ArrowLeft'});
    expect(screen.getByTestId('item-0')).toHaveFocus();

    cleanup();
  });
});

describe('focusItemOnOpen', () => {
  test('true click', () => {
    render(<App focusItemOnOpen={true} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('item-0')).toHaveFocus();
    cleanup();
  });

  test('false click', () => {
    render(<App focusItemOnOpen={false} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('item-0')).not.toHaveFocus();
    cleanup();
  });
});

describe('allowEscape + virtual', () => {
  test('true', () => {
    render(<App allowEscape={true} virtual loop />);
    fireEvent.keyDown(screen.getByRole('button'), {key: 'ArrowDown'});
    expect(screen.getByTestId('item-0').getAttribute('aria-selected')).toBe(
      'true'
    );
    fireEvent.keyDown(screen.getByRole('button'), {key: 'ArrowUp'});
    expect(screen.getByTestId('item-0').getAttribute('aria-selected')).toBe(
      'false'
    );
    fireEvent.keyDown(screen.getByRole('button'), {key: 'ArrowDown'});
    expect(screen.getByTestId('item-0').getAttribute('aria-selected')).toBe(
      'true'
    );
    fireEvent.keyDown(screen.getByRole('button'), {key: 'ArrowDown'});
    expect(screen.getByTestId('item-1').getAttribute('aria-selected')).toBe(
      'true'
    );
    fireEvent.keyDown(screen.getByRole('button'), {key: 'ArrowDown'});
    expect(screen.getByTestId('item-2').getAttribute('aria-selected')).toBe(
      'true'
    );
    fireEvent.keyDown(screen.getByRole('button'), {key: 'ArrowDown'});
    expect(screen.getByTestId('item-2').getAttribute('aria-selected')).toBe(
      'false'
    );
    cleanup();
  });

  test('false', () => {
    render(<App allowEscape={false} virtual loop />);
    fireEvent.keyDown(screen.getByRole('button'), {key: 'ArrowDown'});
    expect(screen.getByTestId('item-0').getAttribute('aria-selected')).toBe(
      'true'
    );
    fireEvent.keyDown(screen.getByRole('button'), {key: 'ArrowDown'});
    expect(screen.getByTestId('item-1').getAttribute('aria-selected')).toBe(
      'true'
    );
    cleanup();
  });

  test('true - onNavigate is called with `null` when escaped', () => {
    const spy = jest.fn();
    render(<App allowEscape virtual loop onNavigate={spy} />);
    fireEvent.keyDown(screen.getByRole('button'), {key: 'ArrowDown'});
    fireEvent.keyDown(screen.getByRole('button'), {key: 'ArrowUp'});
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(null);
    cleanup();
  });
});

describe('openOnArrowKeyDown', () => {
  test('true ArrowDown', () => {
    render(<App openOnArrowKeyDown={true} />);
    fireEvent.keyDown(screen.getByRole('button'), {key: 'ArrowDown'});
    expect(screen.getByRole('menu')).toBeInTheDocument();
    cleanup();
  });

  test('true ArrowUp', () => {
    render(<App openOnArrowKeyDown={true} />);
    fireEvent.keyDown(screen.getByRole('button'), {key: 'ArrowUp'});
    expect(screen.getByRole('menu')).toBeInTheDocument();
    cleanup();
  });

  test('false ArrowDown', () => {
    render(<App openOnArrowKeyDown={false} />);
    fireEvent.keyDown(screen.getByRole('button'), {key: 'ArrowDown'});
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    cleanup();
  });

  test('false ArrowUp', () => {
    render(<App openOnArrowKeyDown={false} />);
    fireEvent.keyDown(screen.getByRole('button'), {key: 'ArrowUp'});
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    cleanup();
  });
});

describe('disabledIndices', () => {
  test('indicies are skipped in focus order', () => {
    render(<App disabledIndices={[0]} />);
    fireEvent.keyDown(screen.getByRole('button'), {key: 'ArrowDown'});
    expect(screen.getByTestId('item-1')).toHaveFocus();
    fireEvent.keyDown(screen.getByRole('menu'), {key: 'ArrowUp'});
    expect(screen.getByTestId('item-1')).toHaveFocus();
    cleanup();
  });
});
