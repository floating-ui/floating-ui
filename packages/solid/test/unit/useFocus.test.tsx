import '@testing-library/jest-dom';

import {cleanup, fireEvent, render, screen} from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import {createSignal, JSX, Show} from 'solid-js';
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
import {promiseRequestAnimationFrame} from '../helper';

vi.useFakeTimers();

function App(props: UseFocusProps & {dismiss?: boolean; hover?: boolean}) {
  const [open, setOpen] = createSignal(false);
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
      <Show when={open()}>
        <div role="tooltip" {...getFloatingProps({ref: refs.setFloating})} />
      </Show>
    </>
  );
}

test('opens on focus', () => {
  render(() => <App />);
  const button = screen.getByRole('button');
  fireEvent.focus(button);
  expect(screen.queryByRole('tooltip')).toBeInTheDocument();
  cleanup();
});

test('closes on blur', () => {
  render(() => <App />);
  const button = screen.getByRole('button');
  button.focus();
  button.blur();

  vi.runAllTimers();

  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  cleanup();
});

test('does not open with a reference pointerDown dismissal', async () => {
  render(() => <App dismiss />);
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

  function Tooltip(props: {children: JSX.Element}) {
    const [open, setOpen] = createSignal(false);

    const floating = useFloating({
      open,
      onOpenChange: setOpen,
    });

    const {getReferenceProps, getFloatingProps} = useInteractions([
      useFocus(floating.context),
    ]);

    return (
      <>
        {/* {cloneElement(children, getReferenceProps({ref: refs.setReference}))} */}
        <button
          data-testId="tooltip-ref"
          {...getReferenceProps()}
          ref={floating.refs.setReference}
        >
          {props.children}
        </button>
        <Show when={open()}>
          <div
            role="tooltip"
            ref={floating.refs.setFloating}
            {...getFloatingProps()}
          >
            Label
          </div>
        </Show>
      </>
    );
  }

  function App() {
    const [open, setOpen] = createSignal(false);

    const floating = useFloating({
      open,
      onOpenChange: setOpen,
    });

    const {getReferenceProps, getFloatingProps} = useInteractions([
      useClick(floating.context),
    ]);

    return (
      <>
        <button
          ref={floating.refs.setReference}
          {...getReferenceProps()}
          data-testId="btn"
        />
        <Show when={open()}>
          <FloatingFocusManager context={floating.context}>
            <div ref={floating.refs.setFloating} {...getFloatingProps()}>
              <button />
              <Tooltip>Tooltip</Tooltip>
            </div>
          </FloatingFocusManager>
        </Show>
      </>
    );
  }

  render(() => <App />);
  const ev = userEvent.setup();
  const btn = screen.getByTestId('btn');
  await ev.click(btn);
  await promiseRequestAnimationFrame();
  await ev.tab();

  expect(screen.queryByRole('tooltip')).toBeInTheDocument();

  await ev.tab();

  // Wait for the timeout in `onBlur()`.
  await new Promise((resolve) => setTimeout(resolve));

  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

  cleanup();
});
