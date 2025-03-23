import type {Coords} from '@floating-ui/react-dom';
import {act, fireEvent, render, screen} from '@testing-library/react';
import {useState} from 'react';
import {test} from 'vitest';

import {useClientPoint, useFloating, useInteractions} from '../../src';

function expectLocation({x, y}: Coords) {
  expect(Number(screen.getByTestId('x')?.textContent)).toBe(x);
  expect(Number(screen.getByTestId('y')?.textContent)).toBe(y);
  expect(Number(screen.getByTestId('width')?.textContent)).toBe(0);
  expect(Number(screen.getByTestId('height')?.textContent)).toBe(0);
}

function App({
  enabled = true,
  point,
  axis,
}: {
  enabled?: boolean;
  point?: Coords;
  axis?: 'both' | 'x' | 'y';
}) {
  const [isOpen, setIsOpen] = useState(false);
  const {refs, elements, context} = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  });
  const clientPoint = useClientPoint(context, {
    enabled,
    ...point,
    axis,
  });
  const {getReferenceProps, getFloatingProps} = useInteractions([clientPoint]);

  const rect = elements.reference?.getBoundingClientRect();

  return (
    <>
      <div
        data-testid="reference"
        ref={refs.setReference}
        {...getReferenceProps()}
        style={{width: 0, height: 0}}
      >
        Reference
      </div>
      {isOpen && (
        <div
          data-testid="floating"
          ref={refs.setFloating}
          {...getFloatingProps()}
        >
          Floating
        </div>
      )}
      <button onClick={() => setIsOpen((v) => !v)} />
      <span data-testid="x">{rect?.x}</span>
      <span data-testid="y">{rect?.y}</span>
      <span data-testid="width">{rect?.width}</span>
      <span data-testid="height">{rect?.height}</span>
    </>
  );
}

test('renders at explicit client point and can be updated', async () => {
  const {rerender} = render(<App point={{x: 0, y: 0}} />);

  fireEvent.click(screen.getByRole('button'));

  await act(async () => {});

  expectLocation({x: 0, y: 0});

  rerender(<App point={{x: 1000, y: 1000}} />);
  await act(async () => {});

  expectLocation({x: 1000, y: 1000});
});

test('renders at mouse event coords', async () => {
  render(<App />);

  await act(async () => {});

  fireEvent(
    screen.getByTestId('reference'),
    new MouseEvent('mousemove', {
      bubbles: true,
      clientX: 500,
      clientY: 500,
    }),
  );
  await act(async () => {});

  expectLocation({x: 500, y: 500});

  fireEvent(
    screen.getByTestId('reference'),
    new MouseEvent('mousemove', {
      bubbles: true,
      clientX: 1000,
      clientY: 1000,
    }),
  );
  await act(async () => {});

  expectLocation({x: 1000, y: 1000});

  // Window listener isn't registered unless the floating element is open.
  fireEvent(
    window,
    new MouseEvent('mousemove', {
      bubbles: true,
      clientX: 700,
      clientY: 700,
    }),
  );
  await act(async () => {});

  expectLocation({x: 1000, y: 1000});

  fireEvent.click(screen.getByRole('button'));
  await act(async () => {});

  fireEvent(
    screen.getByTestId('reference'),
    new MouseEvent('mousemove', {
      bubbles: true,
      clientX: 700,
      clientY: 700,
    }),
  );
  await act(async () => {});

  expectLocation({x: 700, y: 700});

  fireEvent(
    document.body,
    new MouseEvent('mousemove', {
      bubbles: true,
      clientX: 0,
      clientY: 0,
    }),
  );
  await act(async () => {});

  expectLocation({x: 0, y: 0});
});

test('ignores mouse events when explicit coords are specified', async () => {
  render(<App point={{x: 0, y: 0}} />);

  fireEvent(
    screen.getByTestId('reference'),
    new MouseEvent('mousemove', {
      bubbles: true,
      clientX: 500,
      clientY: 500,
    }),
  );
  await act(async () => {});

  expectLocation({x: 0, y: 0});
});

test('cleans up window listener when closing or disabling', async () => {
  const {rerender} = render(<App />);

  fireEvent.click(screen.getByRole('button'));

  fireEvent(
    screen.getByTestId('reference'),
    new MouseEvent('mousemove', {
      bubbles: true,
      clientX: 500,
      clientY: 500,
    }),
  );
  await act(async () => {});

  fireEvent.click(screen.getByRole('button'));

  fireEvent(
    document.body,
    new MouseEvent('mousemove', {
      bubbles: true,
      clientX: 0,
      clientY: 0,
    }),
  );
  await act(async () => {});

  expectLocation({x: 500, y: 500});

  fireEvent.click(screen.getByRole('button'));

  fireEvent(
    document.body,
    new MouseEvent('mousemove', {
      bubbles: true,
      clientX: 500,
      clientY: 500,
    }),
  );
  await act(async () => {});

  expectLocation({x: 500, y: 500});

  rerender(<App enabled={false} />);

  fireEvent(
    document.body,
    new MouseEvent('mousemove', {
      bubbles: true,
      clientX: 0,
      clientY: 0,
    }),
  );
  await act(async () => {});

  expectLocation({x: 500, y: 500});
});

test('axis x', async () => {
  render(<App axis="x" />);

  fireEvent.click(screen.getByRole('button'));

  fireEvent(
    screen.getByTestId('reference'),
    new MouseEvent('mousemove', {
      bubbles: true,
      clientX: 500,
      clientY: 500,
    }),
  );
  await act(async () => {});

  expectLocation({x: 500, y: 0});
});

test('axis y', async () => {
  render(<App axis="y" />);

  fireEvent.click(screen.getByRole('button'));

  fireEvent(
    screen.getByTestId('reference'),
    new MouseEvent('mousemove', {
      bubbles: true,
      clientX: 500,
      clientY: 500,
    }),
  );
  await act(async () => {});

  expectLocation({x: 0, y: 500});
});

test('removes window listener when cursor lands on floating element', async () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button'));

  fireEvent(
    screen.getByTestId('reference'),
    new MouseEvent('mousemove', {
      bubbles: true,
      clientX: 500,
      clientY: 500,
    }),
  );

  fireEvent(
    screen.getByTestId('floating'),
    new MouseEvent('mousemove', {
      bubbles: true,
      clientX: 500,
      clientY: 500,
    }),
  );

  fireEvent(
    document.body,
    new MouseEvent('mousemove', {
      bubbles: true,
      clientX: 0,
      clientY: 0,
    }),
  );
  await act(async () => {});

  expectLocation({x: 500, y: 500});
});
