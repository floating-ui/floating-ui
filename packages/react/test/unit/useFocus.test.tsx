import * as React from 'react';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {cloneElement, useState} from 'react';
import {test} from 'vitest';

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
import {isJSDOM} from '../../src/utils';

beforeAll(() => {
  customElements.define(
    'render-root',
    class RenderRoot extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({mode: 'open'}).appendChild(
          document.createElement('div'),
        );
      }
    },
  );
});

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
      <button {...getReferenceProps({ref: refs.setReference})}>
        <span data-testid="inside-reference" tabIndex={0} />
      </button>
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

test('closes on blur', async () => {
  render(<App />);
  const button = screen.getByRole('button');
  act(() => button.focus());
  act(() => button.blur());
  await waitFor(() => {
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
  cleanup();
});

test.skipIf(isJSDOM())(
  'stays open when focus moves to tooltip rendered inside a shadow root',
  async () => {
    const container = document.body.appendChild(
      document.createElement('render-root'),
    );
    const renderRoot = container.shadowRoot?.firstElementChild as HTMLElement;

    render(<App />, {container: renderRoot});

    const root = within(renderRoot);

    // Open the tooltip by focusing the reference
    const button = root.getByRole('button');
    act(() => button.focus());

    // Move focus to the tooltip
    const tooltip = root.getByRole('tooltip');
    tooltip.focus();

    // trigger the blur event caused by the focus move, note relatedTarget points to the shadow root here
    fireEvent.focusOut(button, {relatedTarget: container});

    expect(root.getByRole('tooltip')).toBeInTheDocument();
    cleanup();
  },
);

test.skipIf(isJSDOM())(
  'stays open when focus moves to element inside reference that is rendered inside a shadow root',
  async () => {
    const container = document.body.appendChild(
      document.createElement('render-root'),
    );
    const renderRoot = container.shadowRoot?.firstElementChild as HTMLElement;

    render(<App />, {container: renderRoot});

    const root = within(renderRoot);

    // Open the tooltip by focusing the reference
    const button = root.getByRole('button');
    act(() => button.focus());

    // Move focus to an element inside the reference
    const insideReference = root.getByTestId('inside-reference');
    act(() => {
      insideReference.focus();
    });

    // trigger the blur event caused by the focus move, note relatedTarget points to the shadow root here
    fireEvent.focusOut(button, {relatedTarget: container});

    expect(root.getByRole('tooltip')).toBeInTheDocument();
    cleanup();
  },
);

test('does not open with a reference pointerDown dismissal', async () => {
  render(<App dismiss />);
  const button = screen.getByRole('button');
  fireEvent.pointerDown(button);
  act(() => button.focus());
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
});

test('does not open when window blurs then receives focus', async () => {
  // TODO — not sure how to test this in JSDOM
});

test.skipIf(isJSDOM())(
  'blurs when hitting an "inside" focus guard',
  async () => {
    function Tooltip({children}: {children: React.JSX.Element}) {
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
  },
);

test('reason string', async () => {
  function App() {
    const [isOpen, setIsOpen] = useState(false);
    const {refs, context} = useFloating({
      open: isOpen,
      onOpenChange(isOpen, _, reason) {
        setIsOpen(isOpen);
        expect(reason).toBe('focus');
      },
    });

    const focus = useFocus(context);
    const {getReferenceProps, getFloatingProps} = useInteractions([focus]);

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
  act(() => button.focus());
  await act(async () => {});
  act(() => button.blur());
  cleanup();
});

describe('visibleOnly prop', () => {
  function App({visibleOnly}: {visibleOnly: boolean}) {
    const [isOpen, setIsOpen] = useState(false);
    const {refs, context} = useFloating({
      open: isOpen,
      onOpenChange: setIsOpen,
    });

    const focus = useFocus(context, {visibleOnly});

    const {getReferenceProps, getFloatingProps} = useInteractions([focus]);

    return (
      <>
        <button>initial</button>
        <button ref={refs.setReference} {...getReferenceProps()}>
          reference
        </button>
        {isOpen && (
          <div role="tooltip" ref={refs.setFloating} {...getFloatingProps()} />
        )}
      </>
    );
  }

  test('true', async () => {
    render(<App visibleOnly />);
    const initial = screen.getByRole('button', {name: 'initial'});
    fireEvent.pointerDown(initial);
    fireEvent.mouseDown(initial);
    await userEvent.tab();
    await act(async () => {});
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
