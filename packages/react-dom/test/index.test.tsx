/**
 * @jest-environment jsdom
 */
import {
  useFloating,
  offset,
  flip,
  shift,
  size,
  arrow,
  hide,
  limitShift,
} from '../src';
import {render, fireEvent, screen, cleanup, act} from '@testing-library/react';
import {useRef, useState, useEffect} from 'react';

test('middleware is always fresh and does not cause an infinite loop', async () => {
  function InlineMiddleware() {
    const arrowRef = useRef(null);
    const {reference, floating} = useFloating({
      placement: 'right',
      middleware: [
        offset(),
        offset(10),
        offset(() => 5),
        offset(() => ({crossAxis: 10})),
        offset({crossAxis: 10, mainAxis: 10}),

        flip({fallbackPlacements: ['top', 'bottom']}),

        shift(),
        shift({crossAxis: true}),
        shift({boundary: document.createElement('div')}),
        shift({boundary: [document.createElement('div')]}),
        shift({limiter: limitShift()}),
        shift({limiter: limitShift({offset: 10})}),
        shift({limiter: limitShift({offset: {crossAxis: 10}})}),
        shift({limiter: limitShift({offset: () => 5})}),
        shift({limiter: limitShift({offset: () => ({crossAxis: 10})})}),

        arrow({element: arrowRef}),

        hide(),

        size({
          apply({availableHeight, elements}) {
            Object.assign(elements.floating.style, {
              maxHeight: `${availableHeight}px`,
            });
          },
        }),
      ],
    });

    return (
      <>
        <div ref={reference} />
        <div ref={floating} />
      </>
    );
  }

  function StateMiddleware() {
    const arrowRef = useRef(null);
    const [middleware, setMiddleware] = useState([
      offset(),
      offset(10),
      offset(() => 5),
      offset(() => ({crossAxis: 10})),
      offset({crossAxis: 10, mainAxis: 10}),

      // should also test `autoPlacement.allowedPlacements`
      // can't have both `flip` and `autoPlacement` in the same middleware
      // array, or multiple `flip`s
      flip({fallbackPlacements: ['top', 'bottom']}),

      shift(),
      shift({crossAxis: true}),
      shift({boundary: document.createElement('div')}),
      shift({boundary: [document.createElement('div')]}),
      shift({limiter: limitShift()}),
      shift({limiter: limitShift({offset: 10})}),
      shift({limiter: limitShift({offset: {crossAxis: 10}})}),
      shift({limiter: limitShift({offset: () => 5})}),
      shift({limiter: limitShift({offset: () => ({crossAxis: 10})})}),

      arrow({element: arrowRef}),

      hide(),

      size({
        apply({availableHeight, elements}) {
          Object.assign(elements.floating.style, {
            maxHeight: `${availableHeight}px`,
          });
        },
      }),
    ]);
    const {x, y, reference, floating} = useFloating({
      placement: 'right',
      middleware,
    });

    return (
      <>
        <div ref={reference} />
        <div ref={floating} />
        <button
          data-testid="step1"
          onClick={() => setMiddleware([offset(10)])}
        />
        <button
          data-testid="step2"
          onClick={() => setMiddleware([offset(() => 5)])}
        />
        <button data-testid="step3" onClick={() => setMiddleware([])} />
        <button data-testid="step4" onClick={() => setMiddleware([flip()])} />
        <div data-testid="x">{x}</div>
        <div data-testid="y">{y}</div>
      </>
    );
  }

  render(<InlineMiddleware />);

  const {getByTestId} = render(<StateMiddleware />);
  fireEvent.click(getByTestId('step1'));

  await act(async () => {});

  expect(getByTestId('x').textContent).toBe('10');

  fireEvent.click(getByTestId('step2'));

  await act(async () => {});

  expect(getByTestId('x').textContent).toBe('5');

  // No `expect` as this test will fail if a render loop occurs
  fireEvent.click(getByTestId('step3'));
  fireEvent.click(getByTestId('step4'));

  await act(async () => {});
});

describe('whileElementsMounted', () => {
  test('is called a single time when both elements mount', () => {
    const spy = jest.fn();

    function App() {
      const {reference, floating} = useFloating({whileElementsMounted: spy});
      return (
        <>
          <button ref={reference} />
          <div ref={floating} />
        </>
      );
    }

    render(<App />);
    expect(spy).toHaveBeenCalledTimes(1);
    cleanup();
  });

  test('is called a single time after floating mounts conditionally', () => {
    const spy = jest.fn();

    function App() {
      const [open, setOpen] = useState(false);
      const {reference, floating} = useFloating({whileElementsMounted: spy});
      return (
        <>
          <button ref={reference} onClick={() => setOpen(true)} />
          {open && <div ref={floating} />}
        </>
      );
    }

    render(<App />);
    expect(spy).toHaveBeenCalledTimes(0);
    fireEvent.click(screen.getByRole('button'));
    expect(spy).toHaveBeenCalledTimes(1);

    cleanup();
  });

  test('is called a single time after reference mounts conditionally', () => {
    const spy = jest.fn();

    function App() {
      const [open, setOpen] = useState(false);
      const {reference, floating} = useFloating({whileElementsMounted: spy});
      return (
        <>
          {open && <button ref={reference} />}
          <div role="tooltip" ref={floating} onClick={() => setOpen(true)} />
        </>
      );
    }

    render(<App />);
    expect(spy).toHaveBeenCalledTimes(0);
    fireEvent.click(screen.getByRole('tooltip'));
    expect(spy).toHaveBeenCalledTimes(1);

    cleanup();
  });

  test('is called a single time both elements mount conditionally', () => {
    const spy = jest.fn();

    function App() {
      const [open, setOpen] = useState(false);
      const {reference, floating} = useFloating({whileElementsMounted: spy});

      useEffect(() => {
        setOpen(true);
      }, []);

      return (
        <>
          {open && <button ref={reference} />}
          {open && <div role="tooltip" ref={floating} />}
        </>
      );
    }

    render(<App />);
    expect(spy).toHaveBeenCalledTimes(1);

    cleanup();
  });

  test('calls the cleanup function', () => {
    const cleanupSpy = jest.fn();
    const spy = jest.fn(() => cleanupSpy);

    function App() {
      const [open, setOpen] = useState(true);
      const {reference, floating} = useFloating({whileElementsMounted: spy});

      useEffect(() => {
        setOpen(false);
      }, []);

      return (
        <>
          {open && <button ref={reference} />}
          {open && <div role="tooltip" ref={floating} />}
        </>
      );
    }

    render(<App />);
    expect(cleanupSpy).toHaveBeenCalledTimes(1);

    // Does not get called again post-cleanup
    expect(spy).toHaveBeenCalledTimes(1);

    cleanup();
  });
});
