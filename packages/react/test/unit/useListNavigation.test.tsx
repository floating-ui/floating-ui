import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {useLayoutEffect, useRef, useState} from 'react';
import {vi} from 'vitest';

import {
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
} from '../../src';
import type {UseListNavigationProps} from '../../src/hooks/useListNavigation';
import {Main as Grid} from '../visual/components/Grid';

function App(props: Omit<Partial<UseListNavigationProps>, 'listRef'>) {
  const [open, setOpen] = useState(false);
  const listRef = useRef<Array<HTMLLIElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState<null | number>(null);
  const {refs, context} = useFloating({
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
      <button {...getReferenceProps({ref: refs.setReference})} />
      {open && (
        <div role="menu" {...getFloatingProps({ref: refs.setFloating})}>
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

test('resets indexRef to -1 upon close', async () => {
  const data = ['a', 'ab', 'abc', 'abcd'];

  function Autocomplete() {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const listRef = useRef<Array<HTMLElement | null>>([]);

    const {x, y, strategy, context, refs} = useFloating<HTMLInputElement>({
      open,
      onOpenChange: setOpen,
    });

    const {getReferenceProps, getFloatingProps, getItemProps} = useInteractions(
      [
        useDismiss(context),
        useListNavigation(context, {
          listRef,
          activeIndex,
          onNavigate: setActiveIndex,
          virtual: true,
          loop: true,
        }),
      ]
    );

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
      const value = event.target.value;
      setInputValue(value);

      if (value) {
        setActiveIndex(null);
        setOpen(true);
      } else {
        setOpen(false);
      }
    }

    const items = data.filter((item) =>
      item.toLowerCase().startsWith(inputValue.toLowerCase())
    );

    return (
      <>
        <input
          {...getReferenceProps({
            ref: refs.setReference,
            onChange,
            value: inputValue,
            placeholder: 'Enter fruit',
            'aria-autocomplete': 'list',
          })}
          data-testid="reference"
        />
        {open && (
          <div
            {...getFloatingProps({
              ref: refs.setFloating,
              style: {
                position: strategy,
                left: x ?? '',
                top: y ?? '',
                background: '#eee',
                color: 'black',
                overflowY: 'auto',
              },
            })}
            data-testid="floating"
          >
            <ul>
              {items.map((item, index) => (
                <li
                  {...getItemProps({
                    key: item,
                    ref(node) {
                      listRef.current[index] = node;
                    },
                    onClick() {
                      setInputValue(item);
                      setOpen(false);
                      refs.domReference.current?.focus();
                    },
                  })}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div data-testid="active-index">{activeIndex}</div>
      </>
    );
  }

  render(<Autocomplete />);

  act(() => screen.getByTestId('reference').focus());
  await userEvent.keyboard('a');

  expect(screen.getByTestId('floating')).toBeInTheDocument();
  expect(screen.getByTestId('active-index').textContent).toBe('');

  await userEvent.keyboard('{ArrowDown}');
  await userEvent.keyboard('{ArrowDown}');
  await userEvent.keyboard('{ArrowDown}');

  expect(screen.getByTestId('active-index').textContent).toBe('2');

  await userEvent.keyboard('{Escape}');

  expect(screen.getByTestId('active-index').textContent).toBe('');

  await userEvent.keyboard('{Backspace}');
  await userEvent.keyboard('a');

  expect(screen.getByTestId('floating')).toBeInTheDocument();
  expect(screen.getByTestId('active-index').textContent).toBe('');

  await userEvent.keyboard('{ArrowDown}');

  expect(screen.getByTestId('active-index').textContent).toBe('0');

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
    const spy = vi.fn();
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
    const spy = vi.fn();
    render(<App onNavigate={spy} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.mouseMove(screen.getByTestId('item-1'));
    expect(screen.getByTestId('item-1')).toHaveFocus();
    fireEvent.pointerLeave(screen.getByTestId('item-1'));
    expect(screen.getByRole('menu')).toHaveFocus();
    expect(spy).toHaveBeenCalledWith(1);
    cleanup();
  });

  test('false - does not focus item on hover and does not sync the active index', async () => {
    const spy = vi.fn();
    render(
      <App onNavigate={spy} focusItemOnOpen={false} focusItemOnHover={false} />
    );
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

test('scheduled list population', async () => {
  function Option({
    listRef,
    getItemProps,
    active,
    index: propIndex,
  }: {
    listRef: React.MutableRefObject<Array<HTMLElement | null>>;
    getItemProps: () => Record<string, unknown>;
    active: boolean;
    index: number;
  }) {
    const [index, setIndex] = useState(-1);

    useLayoutEffect(() => {
      setIndex(propIndex);
    }, [propIndex]);

    return (
      <div
        role="option"
        tabIndex={active ? 0 : -1}
        ref={(node) => {
          if (index !== -1) {
            listRef.current[index] = node;
          }
        }}
        {...getItemProps()}
      />
    );
  }

  function App() {
    const [isOpen, setIsOpen] = useState(false);

    const {refs, context} = useFloating({
      open: isOpen,
      onOpenChange: setIsOpen,
    });

    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const listRef = useRef<Array<HTMLElement | null>>([]);

    const listNavigation = useListNavigation(context, {
      listRef,
      activeIndex,
      onNavigate: setActiveIndex,
    });

    const {getReferenceProps, getFloatingProps, getItemProps} = useInteractions(
      [listNavigation]
    );

    return (
      <>
        <button
          ref={refs.setReference}
          {...getReferenceProps({
            onClick() {
              setIsOpen((v) => !v);
            },
          })}
        >
          Open
        </button>
        {isOpen && (
          <div ref={refs.setFloating} {...getFloatingProps()}>
            {['one', 'two', 'three'].map((option, index) => (
              <Option
                key={option}
                listRef={listRef}
                getItemProps={getItemProps}
                index={index}
                active={activeIndex === index}
              />
            ))}
          </div>
        )}
      </>
    );
  }

  render(<App />);

  fireEvent.keyDown(screen.getByRole('button'), {key: 'ArrowUp'});

  await act(async () => {});

  expect(screen.getAllByRole('option')[2]).toHaveFocus();

  fireEvent.click(screen.getByRole('button'));
  fireEvent.keyDown(screen.getByRole('button'), {key: 'ArrowDown'});

  await act(async () => {});

  expect(screen.getAllByRole('option')[0]).toHaveFocus();
});
