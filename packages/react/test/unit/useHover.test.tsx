import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import {useState} from 'react';
import {vi, test} from 'vitest';

import {useFloating, useHover, useInteractions} from '../../src';
import type {UseHoverProps} from '../../src/hooks/useHover';
import {Popover} from '../visual/components/Popover';
import {Button} from '../visual/lib/Button';
import userEvent from '@testing-library/user-event';

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

  test('restMs + nullish open delay should respect restMs', async () => {
    render(<App restMs={100} delay={{close: 100}} />);

    fireEvent.mouseEnter(screen.getByRole('button'));

    await act(async () => {
      vi.advanceTimersByTime(99);
    });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    cleanup();
  });
});

test('restMs', async () => {
  render(<App restMs={100} />);

  const button = screen.getByRole('button');

  const originalDispatchEvent = button.dispatchEvent;
  const spy = vi.spyOn(button, 'dispatchEvent').mockImplementation((event) => {
    Object.defineProperty(event, 'movementX', {value: 10});
    Object.defineProperty(event, 'movementY', {value: 10});
    return originalDispatchEvent.call(button, event);
  });

  fireEvent.mouseMove(button);

  await act(async () => {
    vi.advanceTimersByTime(99);
  });

  fireEvent.mouseMove(button);

  await act(async () => {
    vi.advanceTimersByTime(1);
  });

  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

  fireEvent.mouseMove(button);

  await act(async () => {
    vi.advanceTimersByTime(100);
  });

  expect(screen.queryByRole('tooltip')).toBeInTheDocument();

  spy.mockRestore();
  cleanup();
});

test('restMs is always 0 for touch input', async () => {
  render(<App restMs={100} />);

  fireEvent.pointerDown(screen.getByRole('button'), {pointerType: 'touch'});
  fireEvent.mouseMove(screen.getByRole('button'));

  await act(async () => {});

  expect(screen.queryByRole('tooltip')).toBeInTheDocument();
});

test('restMs does not cause floating element to open if mouseOnly is true', async () => {
  render(<App restMs={100} mouseOnly />);

  fireEvent.pointerDown(screen.getByRole('button'), {pointerType: 'touch'});
  fireEvent.mouseMove(screen.getByRole('button'));

  await act(async () => {});

  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
});

test('restMs does not reset timer for minor mouse movement', async () => {
  render(<App restMs={100} />);

  const button = screen.getByRole('button');

  const originalDispatchEvent = button.dispatchEvent;
  const spy = vi.spyOn(button, 'dispatchEvent').mockImplementation((event) => {
    Object.defineProperty(event, 'movementX', {value: 1});
    Object.defineProperty(event, 'movementY', {value: 0});
    return originalDispatchEvent.call(button, event);
  });

  fireEvent.mouseMove(button);

  await act(async () => {
    vi.advanceTimersByTime(99);
  });

  fireEvent.mouseMove(button);

  await act(async () => {
    vi.advanceTimersByTime(1);
  });

  expect(screen.queryByRole('tooltip')).toBeInTheDocument();

  spy.mockRestore();
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
    }),
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

test('reason string', async () => {
  function App() {
    const [isOpen, setIsOpen] = useState(false);
    const {refs, context} = useFloating({
      open: isOpen,
      onOpenChange(isOpen, _, reason) {
        setIsOpen(isOpen);
        expect(reason).toBe('hover');
      },
    });

    const hover = useHover(context);
    const {getReferenceProps, getFloatingProps} = useInteractions([hover]);

    return (
      <>
        <button ref={refs.setReference} {...getReferenceProps()} />
        {isOpen && (
          <div role="tooltip" ref={refs.setFloating} {...getFloatingProps()} />
        )}
      </>
    );
  }

  render(<App />);
  const button = screen.getByRole('button');
  fireEvent.mouseEnter(button);
  await act(async () => {});
  fireEvent.mouseLeave(button);
});

test('cleans up blockPointerEvents if trigger changes', async () => {
  vi.useRealTimers();
  const user = userEvent.setup();
  render(
    <Popover
      hover={false}
      modal={false}
      bubbles={true}
      render={({labelId, descriptionId, close}) => (
        <>
          <h2 id={labelId} className="text-2xl font-bold mb-2">
            Parent title
          </h2>
          <p id={descriptionId} className="mb-2">
            Description
          </p>
          <Popover
            hover={true}
            modal={false}
            bubbles={true}
            render={({labelId, descriptionId, close}) => (
              <>
                <h2 id={labelId} className="text-2xl font-bold mb-2">
                  Child title
                </h2>
                <p id={descriptionId} className="mb-2">
                  Description
                </p>
                <button onClick={close} className="font-bold">
                  Close
                </button>
              </>
            )}
          >
            <Button>Open child</Button>
          </Popover>
          <button onClick={close} className="font-bold">
            Close
          </button>
        </>
      )}
    >
      <Button>Open parent</Button>
    </Popover>,
  );

  await user.click(screen.getByText('Open parent'));
  expect(screen.getByText('Parent title')).toBeInTheDocument();
  await user.click(screen.getByText('Open child'));
  expect(screen.getByText('Child title')).toBeInTheDocument();
  await user.click(screen.getByText('Child title'));
  // clean up blockPointerEvents
  // userEvent.unhover does not work because of the pointer-events
  fireEvent.mouseLeave(screen.getByRole('dialog', {name: 'Child title'}));
  expect(screen.getByText('Child title')).toBeInTheDocument();
  await user.click(screen.getByText('Parent title'));
  // screen.debug();
  expect(screen.getByText('Parent title')).toBeInTheDocument();

  vi.useFakeTimers();
});
