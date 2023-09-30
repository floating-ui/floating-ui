import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {cloneElement, useState} from 'react';
import {vi} from 'vitest';

import {
  FloatingFocusManager,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
} from '../../src';
import type {UseFocusProps} from '../../src/hooks/useFocus';

vi.useFakeTimers();

function App(props: UseFocusProps & {dismiss?: boolean; hover?: boolean}) {
  const [open, setOpen] = useState(false);
  const {refs, context} = useFloating({
    open,
    onOpenChange: setOpen,
  });
  const {getReferenceProps, getFloatingProps} = useInteractions([
    useFocus(context, props),
    useDismiss(context, {enabled: !!props.dismiss, referencePress: true}),
    useHover(context, {enabled: !!props.hover}),
  ]);

  return (
    <>
      <button {...getReferenceProps({ref: refs.setReference})} />
      {open && (
        <div role="tooltip" {...getFloatingProps({ref: refs.setFloating})} />
      )}
    </>
  );
}

test('opens on focus', () => {
  render(<App visibleOnly={false} />);
  const button = screen.getByRole('button');
  fireEvent.focus(button);
  expect(screen.queryByRole('tooltip')).toBeInTheDocument();
  cleanup();
});

test('closes on blur', () => {
  render(<App />);
  const button = screen.getByRole('button');
  act(() => button.focus());
  act(() => button.blur());
  act(() => {
    vi.runAllTimers();
  });
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  cleanup();
});

test('does not open with a reference pointerDown dismissal', async () => {
  render(<App dismiss />);
  const button = screen.getByRole('button');
  fireEvent.pointerDown(button);
  fireEvent.focus(button);
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  cleanup();
});

test('does not open when window blurs then receives focus', async () => {
  // TODO — not sure how to test this in JSDOM
});

test('blurs when hitting an "inside" focus guard', async () => {
  vi.useRealTimers();

  function Tooltip({children}: {children: JSX.Element}) {
    const [open, setOpen] = useState(false);

    const {refs, context} = useFloating({
      open,
      onOpenChange: setOpen,
    });

    const {getReferenceProps, getFloatingProps} = useInteractions([
      useFocus(context),
    ]);

    return (
      <>
        {cloneElement(children, getReferenceProps({ref: refs.setReference}))}
        {open && (
          <div role="tooltip" ref={refs.setFloating} {...getFloatingProps()}>
            Label
          </div>
        )}
      </>
    );
  }

  function App() {
    const [open, setOpen] = useState(false);

    const {refs, context} = useFloating({
      open,
      onOpenChange: setOpen,
    });

    const {getReferenceProps, getFloatingProps} = useInteractions([
      useClick(context),
    ]);

    return (
      <>
        <button ref={refs.setReference} {...getReferenceProps()} />
        {open && (
          <FloatingFocusManager context={context}>
            <div ref={refs.setFloating} {...getFloatingProps()}>
              <button />
              <Tooltip>
                <button />
              </Tooltip>
            </div>
          </FloatingFocusManager>
        )}
      </>
    );
  }

  render(<App />);

  await userEvent.click(screen.getByRole('button'));

  await userEvent.tab();

  expect(screen.queryByRole('tooltip')).toBeInTheDocument();

  await userEvent.tab();

  // Wait for the timeout in `onBlur()`.
  await act(() => new Promise((resolve) => setTimeout(resolve)));

  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

  cleanup();
});
