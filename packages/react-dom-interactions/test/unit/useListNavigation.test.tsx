import {fireEvent, render, screen, cleanup} from '@testing-library/react';
import {useRef, useState} from 'react';
import {useListNavigation, useFloating, useInteractions} from '../../src';
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
  expect(document.activeElement).toBe(screen.getByTestId('item-0'));
  cleanup();
});

test('opens on ArrowUp and focuses last item', async () => {
  render(<App />);

  fireEvent.keyDown(screen.getByRole('button'), {key: 'ArrowUp'});
  expect(screen.queryByRole('menu')).toBeInTheDocument();
  expect(document.activeElement).toBe(screen.getByTestId('item-2'));
  cleanup();
});

test('navigates down on ArrowDown', async () => {
  render(<App />);

  fireEvent.keyDown(screen.getByRole('button'), {key: 'ArrowDown'});
  expect(screen.queryByRole('menu')).toBeInTheDocument();
  expect(document.activeElement).toBe(screen.getByTestId('item-0'));

  fireEvent.keyDown(screen.getByRole('menu'), {key: 'ArrowDown'});
  expect(document.activeElement).toBe(screen.getByTestId('item-1'));

  fireEvent.keyDown(screen.getByRole('menu'), {key: 'ArrowDown'});
  expect(document.activeElement).toBe(screen.getByTestId('item-2'));

  // Reached the end of the list.
  fireEvent.keyDown(screen.getByRole('menu'), {key: 'ArrowDown'});
  expect(document.activeElement).toBe(screen.getByTestId('item-2'));

  cleanup();
});

test('navigates up on ArrowUp', async () => {
  render(<App />);

  fireEvent.keyDown(screen.getByRole('button'), {key: 'ArrowUp'});
  expect(screen.queryByRole('menu')).toBeInTheDocument();
  expect(document.activeElement).toBe(screen.getByTestId('item-2'));

  fireEvent.keyDown(screen.getByRole('menu'), {key: 'ArrowUp'});
  expect(document.activeElement).toBe(screen.getByTestId('item-1'));

  fireEvent.keyDown(screen.getByRole('menu'), {key: 'ArrowUp'});
  expect(document.activeElement).toBe(screen.getByTestId('item-0'));

  // Reached the end of the list.
  fireEvent.keyDown(screen.getByRole('menu'), {key: 'ArrowUp'});
  expect(document.activeElement).toBe(screen.getByTestId('item-0'));

  cleanup();
});

describe('loop', () => {
  test('ArrowDown looping', () => {
    render(<App loop />);

    fireEvent.keyDown(screen.getByRole('button'), {key: 'ArrowDown'});
    expect(screen.queryByRole('menu')).toBeInTheDocument();
    expect(document.activeElement).toBe(screen.getByTestId('item-0'));

    fireEvent.keyDown(screen.getByRole('menu'), {key: 'ArrowDown'});
    expect(document.activeElement).toBe(screen.getByTestId('item-1'));

    fireEvent.keyDown(screen.getByRole('menu'), {key: 'ArrowDown'});
    expect(document.activeElement).toBe(screen.getByTestId('item-2'));

    // Reached the end of the list and loops.
    fireEvent.keyDown(screen.getByRole('menu'), {key: 'ArrowDown'});
    expect(document.activeElement).toBe(screen.getByTestId('item-0'));

    cleanup();
  });

  test('ArrowUp looping', () => {
    render(<App loop />);

    fireEvent.keyDown(screen.getByRole('button'), {key: 'ArrowUp'});
    expect(screen.queryByRole('menu')).toBeInTheDocument();
    expect(document.activeElement).toBe(screen.getByTestId('item-2'));

    fireEvent.keyDown(screen.getByRole('menu'), {key: 'ArrowUp'});
    expect(document.activeElement).toBe(screen.getByTestId('item-1'));

    fireEvent.keyDown(screen.getByRole('menu'), {key: 'ArrowUp'});
    expect(document.activeElement).toBe(screen.getByTestId('item-0'));

    // Reached the end of the list and loops.
    fireEvent.keyDown(screen.getByRole('menu'), {key: 'ArrowUp'});
    expect(document.activeElement).toBe(screen.getByTestId('item-2'));

    cleanup();
  });
});

describe('orientation', () => {
  test('navigates down on ArrowDown', async () => {
    render(<App orientation="horizontal" />);

    fireEvent.keyDown(screen.getByRole('button'), {key: 'ArrowRight'});
    expect(screen.queryByRole('menu')).toBeInTheDocument();
    expect(document.activeElement).toBe(screen.getByTestId('item-0'));

    fireEvent.keyDown(screen.getByRole('menu'), {key: 'ArrowRight'});
    expect(document.activeElement).toBe(screen.getByTestId('item-1'));

    fireEvent.keyDown(screen.getByRole('menu'), {key: 'ArrowRight'});
    expect(document.activeElement).toBe(screen.getByTestId('item-2'));

    // Reached the end of the list.
    fireEvent.keyDown(screen.getByRole('menu'), {key: 'ArrowRight'});
    expect(document.activeElement).toBe(screen.getByTestId('item-2'));

    cleanup();
  });

  test('navigates up on ArrowLeft', async () => {
    render(<App orientation="horizontal" />);

    fireEvent.keyDown(screen.getByRole('button'), {key: 'ArrowLeft'});
    expect(screen.queryByRole('menu')).toBeInTheDocument();
    expect(document.activeElement).toBe(screen.getByTestId('item-2'));

    fireEvent.keyDown(screen.getByRole('menu'), {key: 'ArrowLeft'});
    expect(document.activeElement).toBe(screen.getByTestId('item-1'));

    fireEvent.keyDown(screen.getByRole('menu'), {key: 'ArrowLeft'});
    expect(document.activeElement).toBe(screen.getByTestId('item-0'));

    // Reached the end of the list.
    fireEvent.keyDown(screen.getByRole('menu'), {key: 'ArrowLeft'});
    expect(document.activeElement).toBe(screen.getByTestId('item-0'));

    cleanup();
  });
});
