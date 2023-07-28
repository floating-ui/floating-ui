import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import {useState} from 'react';
import {vi} from 'vitest';

import {useFloating, useHover, useInteractions} from '../../src';
import type {UseHoverProps} from '../../src/hooks/useHover';

vi.useFakeTimers();

function App({
  showReference = true,
  ...props
}: UseHoverProps & {showReference?: boolean}) {
  const [open, setOpen] = useState(false);
  const {refs, context} = useFloating({
    open,
    onOpenChange: setOpen,
  });
  const {getReferenceProps, getFloatingProps} = useInteractions([
    useHover(context, props),
  ]);

  return (
    <>
      {showReference && (
        <button {...getReferenceProps({ref: refs.setReference})} />
      )}
      {open && (
        <div role="tooltip" {...getFloatingProps({ref: refs.setFloating})} />
      )}
    </>
  );
}

test('opens on mouseenter', () => {
  render(<App />);

  fireEvent.mouseEnter(screen.getByRole('button'));
  expect(screen.queryByRole('tooltip')).toBeInTheDocument();

  cleanup();
});

test('closes on mouseleave', () => {
  render(<App />);

  fireEvent.mouseEnter(screen.getByRole('button'));
  fireEvent.mouseLeave(screen.getByRole('button'));
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

  cleanup();
});

describe('delay', () => {
  test('symmetric number', async () => {
    render(<App delay={1000} />);

    fireEvent.mouseEnter(screen.getByRole('button'));

    await act(async () => {
      vi.advanceTimersByTime(999);
    });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(1);
    });

    expect(screen.queryByRole('tooltip')).toBeInTheDocument();

    cleanup();
  });

  test('open', async () => {
    render(<App delay={{open: 500}} />);

    fireEvent.mouseEnter(screen.getByRole('button'));

    await act(async () => {
      vi.advanceTimersByTime(499);
    });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(1);
    });

    expect(screen.queryByRole('tooltip')).toBeInTheDocument();

    cleanup();
  });

  test('close', async () => {
    render(<App delay={{close: 500}} />);

    fireEvent.mouseEnter(screen.getByRole('button'));
    fireEvent.mouseLeave(screen.getByRole('button'));

    await act(async () => {
      vi.advanceTimersByTime(499);
    });

    expect(screen.queryByRole('tooltip')).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(1);
    });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    cleanup();
  });

  test('open with close 0', async () => {
    render(<App delay={{open: 500}} />);

    fireEvent.mouseEnter(screen.getByRole('button'));

    await act(async () => {
      vi.advanceTimersByTime(499);
    });

    fireEvent.mouseLeave(screen.getByRole('button'));

    await act(async () => {
      vi.advanceTimersByTime(1);
    });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    cleanup();
  });
});

test('restMs', async () => {
  render(<App restMs={100} />);

  fireEvent.mouseMove(screen.getByRole('button'));

  await act(async () => {
    vi.advanceTimersByTime(99);
  });

  fireEvent.mouseMove(screen.getByRole('button'));

  await act(async () => {
    vi.advanceTimersByTime(1);
  });

  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

  fireEvent.mouseMove(screen.getByRole('button'));

  await act(async () => {
    vi.advanceTimersByTime(100);
  });

  expect(screen.queryByRole('tooltip')).toBeInTheDocument();

  cleanup();
});

test('mouseleave on the floating element closes it (mouse)', async () => {
  render(<App />);

  fireEvent.mouseEnter(screen.getByRole('button'));
  await act(async () => {});

  fireEvent(
    screen.getByRole('button'),
    new MouseEvent('mouseleave', {
      relatedTarget: screen.getByRole('tooltip'),
    })
  );

  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
});

test('does not show after delay if domReference changes', async () => {
  const {rerender} = render(<App delay={1000} />);

  fireEvent.mouseEnter(screen.getByRole('button'));

  await act(async () => {
    vi.advanceTimersByTime(1);
  });

  rerender(<App showReference={false} />);

  await act(async () => {
    vi.advanceTimersByTime(999);
  });

  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

  cleanup();
});
