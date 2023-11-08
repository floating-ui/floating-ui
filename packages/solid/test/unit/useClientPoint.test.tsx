import '@testing-library/jest-dom';

import {cleanup, fireEvent, render, screen} from '@solidjs/testing-library';
import {createMemo, createSignal, Show} from 'solid-js';

import {Coords, useClientPoint, useFloating, useInteractions} from '../../src';
import {promiseRequestAnimationFrame} from '../helper';

function expectLocation({x, y}: Coords) {
  expect(Number(screen.getByTestId('x')?.textContent)).toBe(x);
  expect(Number(screen.getByTestId('y')?.textContent)).toBe(y);
  expect(Number(screen.getByTestId('width')?.textContent)).toBe(0);
  expect(Number(screen.getByTestId('height')?.textContent)).toBe(0);
}

function App(props: {point?: Coords; axis?: 'both' | 'x' | 'y'}) {
  const [isOpen, setIsOpen] = createSignal(false);
  const [enabled, setEnabled] = createSignal(true);
  const {refs, context} = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  });
  const [coords, setCoords] = createSignal({
    x: props.point?.x,
    y: props.point?.y,
  });
  const clientPoint = useClientPoint(context, {
    enabled: enabled,
    x: coords().x,
    y: coords().y,
    axis: props.axis,
  });
  const {getReferenceProps, getFloatingProps} = useInteractions([clientPoint]);

  const rect = createMemo(() => refs.reference()?.getBoundingClientRect());

  return (
    <>
      <button
        data-testid="changecoords"
        onClick={() => setCoords({x: 1000, y: 1000})}
      />
      <div
        data-testid="reference"
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        Reference
      </div>
      <Show when={isOpen()}>
        <div
          //@ts-ignore
          style={{'pointer-events': 'none'}}
          data-testid="floating"
          ref={refs.setFloating}
          {...getFloatingProps()}
        >
          Floating
        </div>
      </Show>
      <button data-testId="toggle" onClick={() => setIsOpen((v) => !v)} />
      <button data-testId="enabled" onClick={() => setEnabled((v) => !v)} />
      <span data-testid="x">{rect()?.x}</span>
      <span data-testid="y">{rect()?.y}</span>
      <span data-testid="width">{rect()?.width}</span>
      <span data-testid="height">{rect()?.height}</span>
    </>
  );
}

test('renders at explicit client point and can be updated', async () => {
  render(() => <App point={{x: 0, y: 0}} />);

  fireEvent.click(screen.getByTestId('toggle'));
  expectLocation({x: 0, y: 0});

  // rerender(() => <App point={{x: 1000, y: 1000}} />);
  // fireEvent.click(screen.getByTestId('changecoords'));
  // await promiseRequestAnimationFrame();
  cleanup();
  render(() => <App point={{x: 1000, y: 1000}} />);
  expectLocation({x: 1000, y: 1000});
});

test('renders at mouse event coords', async () => {
  render(() => <App />);

  await promiseRequestAnimationFrame();

  fireEvent(
    screen.getByTestId('reference'),
    new MouseEvent('mousemove', {
      bubbles: true,
      clientX: 500,
      clientY: 500,
    }),
  );

  expectLocation({x: 500, y: 500});

  fireEvent(
    screen.getByTestId('reference'),
    new MouseEvent('mousemove', {
      bubbles: true,
      clientX: 1000,
      clientY: 1000,
    }),
  );

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

  expectLocation({x: 1000, y: 1000});

  fireEvent.click(screen.getByTestId('toggle'));

  fireEvent(
    screen.getByTestId('reference'),
    new MouseEvent('mousemove', {
      bubbles: true,
      clientX: 600,
      clientY: 600,
    }),
  );

  expectLocation({x: 600, y: 600});

  fireEvent(
    document.body,
    new MouseEvent('mousemove', {
      bubbles: true,
      clientX: 0,
      clientY: 0,
    }),
  );

  expectLocation({x: 0, y: 0});
});

test('ignores mouse events when explicit coords are specified', async () => {
  render(() => <App point={{x: 0, y: 0}} />);

  fireEvent(
    screen.getByTestId('reference'),
    new MouseEvent('mousemove', {
      bubbles: true,
      clientX: 500,
      clientY: 500,
    }),
  );

  expectLocation({x: 0, y: 0});
});

test('cleans up window listener when closing or disabling', async () => {
  render(() => <App />);

  fireEvent.click(screen.getByTestId('reference'));

  fireEvent(
    screen.getByTestId('reference'),
    new MouseEvent('mousemove', {
      bubbles: true,
      clientX: 500,
      clientY: 500,
    }),
  );
  await promiseRequestAnimationFrame();

  fireEvent.click(screen.getByTestId('reference'));

  fireEvent(
    document.body,
    new MouseEvent('mousemove', {
      bubbles: true,
      clientX: 0,
      clientY: 0,
    }),
  );
  await promiseRequestAnimationFrame();

  expectLocation({x: 500, y: 500});

  fireEvent.click(screen.getByTestId('reference'));

  fireEvent(
    document.body,
    new MouseEvent('mousemove', {
      bubbles: true,
      clientX: 500,
      clientY: 500,
    }),
  );
  await promiseRequestAnimationFrame();

  expectLocation({x: 500, y: 500});

  // rerender(() => <App enabled={false} />);
  fireEvent.click(screen.getByTestId('enabled'));
  fireEvent(
    document.body,
    new MouseEvent('mousemove', {
      bubbles: true,
      clientX: 0,
      clientY: 0,
    }),
  );
  await promiseRequestAnimationFrame();

  expectLocation({x: 500, y: 500});
});

test('axis x', async () => {
  render(() => <App axis="x" />);

  fireEvent.click(screen.getByTestId('reference'));

  fireEvent(
    screen.getByTestId('reference'),
    new MouseEvent('mousemove', {
      bubbles: true,
      clientX: 500,
      clientY: 500,
    }),
  );

  expectLocation({x: 500, y: 0});
});

test('axis y', async () => {
  render(() => <App axis="y" />);

  fireEvent.click(screen.getByTestId('reference'));

  fireEvent(
    screen.getByTestId('reference'),
    new MouseEvent('mousemove', {
      bubbles: true,
      clientX: 500,
      clientY: 500,
    }),
  );

  expectLocation({x: 0, y: 500});
});

test('removes window listener when cursor lands on floating element', async () => {
  render(() => <App />);

  fireEvent.click(screen.getByTestId('toggle'));

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

  expectLocation({x: 500, y: 500});
});
