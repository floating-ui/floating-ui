import {render, screen} from '@testing-library/react';
import {useCallback, useLayoutEffect} from 'react';

import {
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
} from '../../src';
import {isElement} from '../../src/utils/is';

describe('positionReference', () => {
  test('sets separate refs', () => {
    function App() {
      const {reference, positionReference, refs} =
        useFloating<HTMLDivElement>();

      return (
        <>
          <div ref={reference} data-testid="reference" />
          <div ref={positionReference} data-testid="position-reference" />
          <div data-testid="reference-text">
            {String(refs.domReference.current?.getAttribute('data-testid'))}
          </div>
          <div data-testid="position-reference-text">
            {String(isElement(refs.reference.current))}
          </div>
        </>
      );
    }

    const {getByTestId, rerender} = render(<App />);

    expect(getByTestId('reference-text').textContent).toBe('reference');
    expect(getByTestId('position-reference-text').textContent).toBe('false');

    rerender(<App />);

    expect(getByTestId('reference-text').textContent).toBe('reference');
    expect(getByTestId('position-reference-text').textContent).toBe('false');
  });

  test('handles unstable reference prop', () => {
    function App() {
      const {reference, positionReference, refs} =
        useFloating<HTMLDivElement>();

      return (
        <>
          <div ref={(node) => reference(node)} data-testid="reference" />
          <div ref={positionReference} data-testid="position-reference" />
          <div data-testid="reference-text">
            {String(refs.domReference.current?.getAttribute('data-testid'))}
          </div>
          <div data-testid="position-reference-text">
            {String(isElement(refs.reference.current))}
          </div>
        </>
      );
    }

    const {getByTestId, rerender} = render(<App />);

    expect(getByTestId('reference-text').textContent).toBe('reference');
    expect(getByTestId('position-reference-text').textContent).toBe('false');

    rerender(<App />);

    expect(getByTestId('reference-text').textContent).toBe('reference');
    expect(getByTestId('position-reference-text').textContent).toBe('false');
  });

  test('handles real virtual element', () => {
    function App() {
      const {reference, positionReference, refs} = useFloating();

      useLayoutEffect(() => {
        positionReference({
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
      }, [positionReference]);

      return (
        <>
          <div ref={(node) => reference(node)} data-testid="reference" />
          <div data-testid="reference-text">
            {String(refs.domReference.current?.getAttribute('data-testid'))}
          </div>
          <div data-testid="position-reference-text">
            {refs.reference.current?.getBoundingClientRect().x}
          </div>
        </>
      );
    }

    const {getByTestId, rerender} = render(<App />);

    expect(getByTestId('reference-text').textContent).toBe('reference');
    expect(getByTestId('position-reference-text').textContent).toBe('218');

    rerender(<App />);

    expect(getByTestId('reference-text').textContent).toBe('reference');
    expect(getByTestId('position-reference-text').textContent).toBe('218');
  });
});

describe('#2129: interactions.getFloatingProps as a dep does not cause setState loop', () => {
  function App() {
    const {refs, context} = useFloating({
      open: true,
    });

    const interactions = useInteractions([
      useHover(context),
      useClick(context),
      useFocus(context),
      useDismiss(context),
    ]);

    const Tooltip = useCallback(() => {
      return (
        <div
          data-testid="floating"
          ref={refs.setFloating}
          {...interactions.getFloatingProps()}
        />
      );
    }, [refs, interactions]);

    return (
      <>
        <div ref={refs.setReference} {...interactions.getReferenceProps()} />
        <Tooltip />
      </>
    );
  }

  render(<App />);

  expect(screen.queryByTestId('floating')).toBeInTheDocument();
});
