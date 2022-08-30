import {useState} from 'react';
import {cleanup, fireEvent, render, screen, act} from '@testing-library/react';
import {useHover, useInteractions, useFloating} from '../../src';
import type {Props} from '../../src/hooks/useHover';

jest.useFakeTimers();

function App({
  showReference = true,
  ...props
}: Props & {showReference?: boolean}) {
  const [open, setOpen] = useState(false);
  const {reference, floating, context} = useFloating({
    open,
    onOpenChange: setOpen,
  });
  const {getReferenceProps, getFloatingProps} = useInteractions([
    useHover(context, props),
  ]);

  return (
    <>
      {showReference && <button {...getReferenceProps({ref: reference})} />}
      {open && <div role="tooltip" {...getFloatingProps({ref: floating})} />}
    </>
  );
}

test('opens on mouseenter', () => {
  render(<App />);

  fireEvent.pointerEnter(screen.getByRole('button'));
  expect(screen.queryByRole('tooltip')).toBeInTheDocument();

  cleanup();
});

test('closes on mouseleave', () => {
  render(<App />);

  fireEvent.pointerEnter(screen.getByRole('button'));
  fireEvent.pointerLeave(screen.getByRole('button'));
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

  cleanup();
});

describe('delay', () => {
  test('symmetric number', async () => {
    render(<App delay={1000} />);

    fireEvent.pointerEnter(screen.getByRole('button'));

    await act(async () => {
      jest.advanceTimersByTime(999);
    });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(1);
    });

    expect(screen.queryByRole('tooltip')).toBeInTheDocument();

    cleanup();
  });

  test('open', async () => {
    render(<App delay={{open: 500}} />);

    fireEvent.pointerEnter(screen.getByRole('button'));

    await act(async () => {
      jest.advanceTimersByTime(499);
    });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(1);
    });

    expect(screen.queryByRole('tooltip')).toBeInTheDocument();

    cleanup();
  });

  test('close', async () => {
    render(<App delay={{close: 500}} />);

    fireEvent.pointerEnter(screen.getByRole('button'));
    fireEvent.pointerLeave(screen.getByRole('button'));

    await act(async () => {
      jest.advanceTimersByTime(499);
    });

    expect(screen.queryByRole('tooltip')).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(1);
    });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    cleanup();
  });

  test('open with close 0', async () => {
    render(<App delay={{open: 500}} />);

    fireEvent.pointerEnter(screen.getByRole('button'));

    await act(async () => {
      jest.advanceTimersByTime(499);
    });

    fireEvent.pointerLeave(screen.getByRole('button'));

    await act(async () => {
      jest.advanceTimersByTime(1);
    });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    cleanup();
  });
});

test('restMs', async () => {
  render(<App restMs={100} />);

  fireEvent.pointerMove(screen.getByRole('button'));

  await act(async () => {
    jest.advanceTimersByTime(99);
  });

  fireEvent.pointerMove(screen.getByRole('button'));

  await act(async () => {
    jest.advanceTimersByTime(1);
  });

  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

  fireEvent.pointerMove(screen.getByRole('button'));

  await act(async () => {
    jest.advanceTimersByTime(100);
  });

  expect(screen.queryByRole('tooltip')).toBeInTheDocument();

  cleanup();
});

test('continues working after reference is conditionally rendered', () => {
  const {rerender} = render(<App showReference={false} />);
  rerender(<App showReference />);

  fireEvent.pointerEnter(screen.getByRole('button'));

  expect(screen.queryByRole('tooltip')).toBeInTheDocument();

  cleanup();
});
