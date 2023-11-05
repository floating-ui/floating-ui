import '@testing-library/jest-dom';

import {isElement} from '@floating-ui/utils/dom';
import {cleanup, fireEvent, render, screen} from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import {createEffect, createSignal, Show} from 'solid-js';
import {vi} from 'vitest';

import {
  ReferenceElement,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
} from '../../src';
import {promiseRequestAnimationFrame} from '../helper';

describe('positionReference', () => {
  test('sets separate refs', () => {
    function App() {
      const floating = useFloating<HTMLDivElement>();

      return (
        <>
          <div ref={floating.refs.setReference} data-testid="reference" />
          <div
            ref={floating.refs.setPositionReference}
            data-testid="position-reference"
          />
          <div data-testid="reference-text">
            {String(floating.refs.domReference?.getAttribute('data-testid'))}
          </div>
          <div data-testid="position-reference-text">
            {String(isElement(floating.refs.reference))}
          </div>
        </>
      );
    }

    const {getByTestId} = render(() => <App />);

    expect(getByTestId('reference-text').textContent).toBe('reference');
    expect(getByTestId('position-reference-text').textContent).toBe('false');

    render(() => <App />);

    expect(getByTestId('reference-text').textContent).toBe('reference');
    expect(getByTestId('position-reference-text').textContent).toBe('false');
  });

  test('handles unstable reference prop', () => {
    function App() {
      const floating = useFloating<HTMLDivElement>();

      return (
        <>
          <div
            ref={(node) => floating.refs.setReference(node)}
            data-testid="reference"
          />
          <div
            ref={floating.refs.setPositionReference}
            data-testid="position-reference"
          />
          <div data-testid="reference-text">
            {String(floating.refs.domReference?.getAttribute('data-testid'))}
          </div>
          <div data-testid="position-reference-text">
            {String(isElement(floating.refs.reference()))}
          </div>
        </>
      );
    }

    const {getByTestId} = render(() => <App />);

    expect(getByTestId('reference-text').textContent).toBe('reference');
    expect(getByTestId('position-reference-text').textContent).toBe('false');

    render(() => <App />);

    expect(getByTestId('reference-text').textContent).toBe('reference');
    expect(getByTestId('position-reference-text').textContent).toBe('false');
  });

  test('handles real virtual element', () => {
    function App() {
      const floating = useFloating();

      createEffect(() => {
        floating.refs.setPositionReference({
          getBoundingClientRect: () => ({
            x: 218,
            y: 0,
            width: 0,
            height: 0,
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }),
        });
      });

      return (
        <>
          <div
            ref={(node) => floating.refs.setReference(node)}
            data-testid="reference"
          />
          <div data-testid="reference-text">
            {String(
              floating.refs.domReference?.getAttribute('data-testid') ?? '',
            )}
          </div>
          <div data-testid="position-reference-text">
            {floating.refs.reference()?.getBoundingClientRect().x}
          </div>
        </>
      );
    }

    const {getByTestId} = render(() => <App />);

    expect(getByTestId('reference-text').textContent).toBe('reference');
    expect(getByTestId('position-reference-text').textContent).toBe('218');

    render(() => <App />);

    expect(getByTestId('reference-text').textContent).toBe('reference');
    expect(getByTestId('position-reference-text').textContent).toBe('218');
  });
});

test('#2129: interactions.getFloatingProps as a dep does not cause setState loop', () => {
  function App() {
    const floating = useFloating({
      open: true,
    });
    const {context} = floating;
    const interactions = useInteractions([
      useHover(context),
      useClick(context),
      useFocus(context),
      useDismiss(context),
    ]);

    const Tooltip = () => {
      return (
        <div
          data-testid="floating"
          ref={floating.refs.setFloating}
          {...interactions.getFloatingProps()}
        />
      );
    };

    return (
      <>
        <div
          ref={floating.refs.setReference}
          {...interactions.getReferenceProps()}
        />
        <Tooltip />
      </>
    );
  }

  render(() => <App />);

  expect(screen.queryByTestId('floating')).toBeInTheDocument();
});

test('reference() refers to externally synchronized `reference`', async () => {
  function App() {
    const [referenceEl, setReferenceEl] = createSignal<Element | null>(null);
    const [isOpen, setIsOpen] = createSignal(false);
    const {refs, context} = useFloating({
      open: isOpen,
      onOpenChange: setIsOpen,
      elements: {reference: referenceEl},
    });

    const hover = useHover(context);

    const {getReferenceProps, getFloatingProps} = useInteractions([hover]);

    return (
      <>
        <button
          ref={setReferenceEl}
          {...getReferenceProps()}
          data-testId="btn"
        />
        <Show when={isOpen()}>
          <div role="dialog" ref={refs.setFloating} {...getFloatingProps()} />
        </Show>
      </>
    );
  }

  render(() => <App />);

  await userEvent.hover(screen.getByTestId('btn'));

  expect(screen.getByRole('dialog')).toBeInTheDocument();
});

test('onOpenChange is passed an event as second param', async () => {
  const onOpenChange = vi.fn();

  function App() {
    const [isOpen, setIsOpen] = createSignal(false);
    const {refs, context} = useFloating({
      open: isOpen,
      onOpenChange(open, event) {
        onOpenChange(open, event);
        setIsOpen(open);
      },
    });

    const hover = useHover(context, {
      move: false,
    });

    const {getReferenceProps, getFloatingProps} = useInteractions([hover]);

    return (
      <>
        <button ref={refs.setReference} {...getReferenceProps()} />
        <Show when={isOpen()}>
          <div ref={refs.setFloating} {...getFloatingProps()} />
        </Show>
      </>
    );
  }

  render(() => <App />);

  await userEvent.hover(screen.getByRole('button'));

  expect(onOpenChange.mock.calls[0][0]).toBe(true);
  expect(onOpenChange.mock.calls[0][1]).toBeInstanceOf(MouseEvent);

  await userEvent.unhover(screen.getByRole('button'));

  expect(onOpenChange.mock.calls[1][0]).toBe(false);
  expect(onOpenChange.mock.calls[1][1]).toBeInstanceOf(MouseEvent);
});
