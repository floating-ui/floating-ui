import '@testing-library/jest-dom';

import {cleanup, fireEvent, render, screen} from '@solidjs/testing-library';
import {
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  Show,
} from 'solid-js';
import {vi} from 'vitest';

import {useFloating, useHover, useInteractions} from '../../src';
import type {UseHoverProps} from '../../src/hooks/useHover';

vi.useFakeTimers();

function App(props: UseHoverProps) {
  const [showReference, setShowReference] = createSignal(true);
  const [open, setOpen] = createSignal(false);
  const {refs, context} = useFloating({
    open,
    onOpenChange: setOpen,
  });

  const {getReferenceProps, getFloatingProps} = useInteractions([
    useHover(context, props),
  ]);

  createEffect(() => {
    //in solid we have to set the reference to null if the reference unmounts. Otherwise the ref will still be in the
    if (!showReference()) refs.setReference(null);
  });

  return (
    <>
      <Show when={showReference()}>
        <button {...getReferenceProps({ref: refs.setReference})} />
        <div
          onClick={() => setShowReference(false)}
          data-testId="toggle-show-reference"
        />
      </Show>
      <Show when={open()}>
        <div role="tooltip" {...getFloatingProps({ref: refs.setFloating})} />
      </Show>
    </>
  );
}

test('opens on mouseenter', () => {
  render(() => <App />);

  fireEvent.mouseEnter(screen.getByRole('button'));
  expect(screen.queryByRole('tooltip')).toBeInTheDocument();

  cleanup();
});

test('closes on mouseleave', () => {
  render(() => <App />);

  fireEvent.mouseEnter(screen.getByRole('button'));
  fireEvent.mouseLeave(screen.getByRole('button'));
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

  cleanup();
});

describe('delay', () => {
  beforeEach(cleanup);
  test('symmetric number', async () => {
    render(() => <App delay={1000} />);

    fireEvent.mouseEnter(screen.getByRole('button'));

    await Promise.resolve(vi.advanceTimersByTime(999));

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    await Promise.resolve(vi.advanceTimersByTime(1));

    expect(screen.queryByRole('tooltip')).toBeInTheDocument();

    cleanup();
  });

  test('open', async () => {
    render(() => <App delay={{open: 500}} />);

    fireEvent.mouseEnter(screen.getByRole('button'));

    await Promise.resolve(vi.advanceTimersByTime(499));

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    await Promise.resolve(vi.advanceTimersByTime(1));

    expect(screen.queryByRole('tooltip')).toBeInTheDocument();

    cleanup();
  });

  test('close', async () => {
    render(() => <App delay={{close: 500}} />);

    fireEvent.mouseEnter(screen.getByRole('button'));
    fireEvent.mouseLeave(screen.getByRole('button'));

    await Promise.resolve(vi.advanceTimersByTime(499));

    expect(screen.queryByRole('tooltip')).toBeInTheDocument();

    await Promise.resolve(vi.advanceTimersByTime(1));

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    cleanup();
  });

  test('open with close 0', async () => {
    render(() => <App delay={{open: 500}} />);

    fireEvent.mouseEnter(screen.getByRole('button'));

    await Promise.resolve(vi.advanceTimersByTime(499));

    fireEvent.mouseLeave(screen.getByRole('button'));

    await Promise.resolve(vi.advanceTimersByTime(1));

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    cleanup();
  });
});

test('restMs', async () => {
  render(() => <App restMs={100} />);

  fireEvent.mouseMove(screen.getByRole('button'));

  await Promise.resolve(vi.advanceTimersByTime(99));

  fireEvent.mouseMove(screen.getByRole('button'));

  await Promise.resolve(vi.advanceTimersByTime(1));

  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

  fireEvent.mouseMove(screen.getByRole('button'));

  await Promise.resolve(vi.advanceTimersByTime(100));

  expect(screen.queryByRole('tooltip')).toBeInTheDocument();

  cleanup();
});

test('mouseleave on the floating element closes it (mouse)', async () => {
  render(() => <App />);

  fireEvent.mouseEnter(screen.getByRole('button'));
  expect(screen.queryByRole('tooltip')).toBeInTheDocument();
  fireEvent(
    screen.getByRole('button'),
    new MouseEvent('mouseleave', {
      relatedTarget: screen.getByRole('tooltip'),
    }),
  );

  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
});

test('does not show after delay if domReference changes', async () => {
  render(() => <App delay={1000} />);

  fireEvent.mouseEnter(screen.getByRole('button'));

  await Promise.resolve(vi.advanceTimersByTime(1));

  // render(() => <App showReference={false} />);
  fireEvent.click(screen.getByTestId('toggle-show-reference'));
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
  await Promise.resolve(vi.advanceTimersByTime(999));

  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

  cleanup();
});
