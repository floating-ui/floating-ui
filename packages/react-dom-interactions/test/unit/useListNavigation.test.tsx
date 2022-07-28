import {fireEvent, render, screen, cleanup, act} from '@testing-library/react';
import {useRef, useState} from 'react';
import {
  useListNavigation,
  useFloating,
  useInteractions,
  useClick,
} from '../../src';
import type {Props} from '../../src/hooks/useListNavigation';
import {Main as Grid} from '../visual/components/Grid';

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

describe('focusOnHover', () => {
  test('true - focuses item on hover and syncs the active index', () => {
    const spy = jest.fn();
    render(<App onNavigate={spy} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.mouseMove(screen.getByTestId('item-1'));
    expect(screen.getByTestId('item-1')).toHaveFocus();
    fireEvent.pointerLeave(screen.getByTestId('item-1'));
    expect(screen.getByRole('menu')).toHaveFocus();
    expect(spy).toHaveBeenCalledWith(1);
    cleanup();
  });

  test('false - does not focus item on hover and does not sync the active index', () => {
    const spy = jest.fn();
    render(<App onNavigate={spy} focusItemOnHover={false} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.mouseMove(screen.getByTestId('item-1'));
    expect(screen.getByTestId('item-1')).not.toHaveFocus();
    expect(spy).toHaveBeenCalledTimes(0);
    cleanup();
  });
});

describe('grid navigation', () => {
  test('focuses first non-disabled item in grid', () => {
    render(<Grid />);
    fireEvent.keyDown(screen.getByRole('button'), {key: 'Enter'});
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getAllByRole('option')[8]).toHaveFocus();
    cleanup();
  });

  test('focuses next item using ArrowRight key, skipping disabled items', () => {
    render(<Grid />);
    fireEvent.keyDown(screen.getByRole('button'), {key: 'Enter'});
    fireEvent.click(screen.getByRole('button'));
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowRight'});
    expect(screen.getAllByRole('option')[9]).toHaveFocus();
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowRight'});
    expect(screen.getAllByRole('option')[11]).toHaveFocus();
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowRight'});
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowRight'});
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowRight'});
    expect(screen.getAllByRole('option')[14]).toHaveFocus();
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowRight'});
    expect(screen.getAllByRole('option')[16]).toHaveFocus();
    cleanup();
  });

  test('focuses previous item using ArrowLeft key, skipping disabled items', () => {
    render(<Grid />);
    fireEvent.keyDown(screen.getByRole('button'), {key: 'Enter'});
    fireEvent.click(screen.getByRole('button'));

    act(() => screen.getAllByRole('option')[47].focus());

    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowLeft'});
    expect(screen.getAllByRole('option')[46]).toHaveFocus();
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowLeft'});
    expect(screen.getAllByRole('option')[44]).toHaveFocus();
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowLeft'});
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowLeft'});
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowLeft'});
    expect(screen.getAllByRole('option')[41]).toHaveFocus();
    cleanup();
  });

  test('skips row and remains on same column when pressing ArrowDown', () => {
    render(<Grid />);
    fireEvent.keyDown(screen.getByRole('button'), {key: 'Enter'});
    fireEvent.click(screen.getByRole('button'));
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowDown'});
    expect(screen.getAllByRole('option')[13]).toHaveFocus();
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowDown'});
    expect(screen.getAllByRole('option')[18]).toHaveFocus();
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowDown'});
    expect(screen.getAllByRole('option')[23]).toHaveFocus();
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowDown'});
    expect(screen.getAllByRole('option')[28]).toHaveFocus();

    cleanup();
  });

  test('skips row and remains on same column when pressing ArrowUp', () => {
    render(<Grid />);
    fireEvent.keyDown(screen.getByRole('button'), {key: 'Enter'});
    fireEvent.click(screen.getByRole('button'));

    act(() => screen.getAllByRole('option')[47].focus());

    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowUp'});
    expect(screen.getAllByRole('option')[42]).toHaveFocus();
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowUp'});
    expect(screen.getAllByRole('option')[37]).toHaveFocus();
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowUp'});
    expect(screen.getAllByRole('option')[32]).toHaveFocus();
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowUp'});
    expect(screen.getAllByRole('option')[27]).toHaveFocus();

    cleanup();
  });

  test('loops on the same column with ArrowDown', () => {
    render(<Grid loop />);
    fireEvent.keyDown(screen.getByRole('button'), {key: 'Enter'});
    fireEvent.click(screen.getByRole('button'));

    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowDown'});
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowDown'});
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowDown'});
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowDown'});
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowDown'});
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowDown'});
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowDown'});
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowDown'});

    expect(screen.getAllByRole('option')[8]).toHaveFocus();

    cleanup();
  });

  test('loops on the same column with ArrowUp', () => {
    render(<Grid loop />);
    fireEvent.keyDown(screen.getByRole('button'), {key: 'Enter'});
    fireEvent.click(screen.getByRole('button'));

    act(() => screen.getAllByRole('option')[43].focus());

    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowUp'});
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowUp'});
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowUp'});
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowUp'});
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowUp'});
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowUp'});
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowUp'});
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowUp'});

    expect(screen.getAllByRole('option')[43]).toHaveFocus();

    cleanup();
  });

  test('does not leave row with "both" orientation while looping', () => {
    render(<Grid orientation="both" loop />);
    fireEvent.keyDown(screen.getByRole('button'), {key: 'Enter'});
    fireEvent.click(screen.getByRole('button'));

    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowRight'});
    expect(screen.getAllByRole('option')[9]).toHaveFocus();
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowRight'});
    expect(screen.getAllByRole('option')[8]).toHaveFocus();
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowLeft'});
    expect(screen.getAllByRole('option')[9]).toHaveFocus();
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowLeft'});
    expect(screen.getAllByRole('option')[8]).toHaveFocus();

    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowDown'});
    expect(screen.getAllByRole('option')[13]).toHaveFocus();
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowRight'});
    expect(screen.getAllByRole('option')[14]).toHaveFocus();
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowRight'});
    expect(screen.getAllByRole('option')[11]).toHaveFocus();
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowLeft'});
    expect(screen.getAllByRole('option')[14]).toHaveFocus();

    cleanup();
  });

  test('looping works on last row', () => {
    render(<Grid orientation="both" loop />);
    fireEvent.keyDown(screen.getByRole('button'), {key: 'Enter'});
    fireEvent.click(screen.getByRole('button'));

    act(() => screen.getAllByRole('option')[46].focus());

    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowRight'});
    expect(screen.getAllByRole('option')[47]).toHaveFocus();
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowRight'});
    expect(screen.getAllByRole('option')[46]).toHaveFocus();
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowLeft'});
    expect(screen.getAllByRole('option')[47]).toHaveFocus();
    fireEvent.keyDown(screen.getByTestId('floating'), {key: 'ArrowLeft'});
    expect(screen.getAllByRole('option')[46]).toHaveFocus();

    cleanup();
  });
});
