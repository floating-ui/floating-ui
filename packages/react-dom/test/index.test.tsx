/**
 * @jest-environment jsdom
 */
import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import {useEffect, useLayoutEffect, useRef, useState} from 'react';

import {
  arrow,
  flip,
  hide,
  limitShift,
  offset,
  shift,
  size,
  useFloating,
} from '../src';

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

test('unstable callback refs', async () => {
  function App() {
    const {reference, floating} = useFloating();

    return (
      <>
        <div ref={(node) => reference(node)} />
        <div ref={(node) => floating(node)} />
      </>
    );
  }

  render(<App />);

  await act(async () => {});

  cleanup();
});

test('callback refs invoked during render', async () => {
  function App() {
    const [r, setR] = useState<HTMLDivElement | null>(null);
    const [f, setF] = useState<HTMLDivElement | null>(null);

    const {reference, floating} = useFloating();

    reference(r);
    floating(f);

    return (
      <>
        <div ref={setR} />
        <div ref={setF} />
      </>
    );
  }

  render(<App />);

  await act(async () => {});

  cleanup();
});

test('isPositioned', async () => {
  const spy = jest.fn();

  function App() {
    const [open, setOpen] = useState(false);
    const {reference, floating, isPositioned} = useFloating({
      open,
    });

    useLayoutEffect(() => {
      spy(isPositioned);
    }, [isPositioned]);

    return (
      <>
        <button ref={reference} onClick={() => setOpen((v) => !v)} />
        {open && <div ref={floating} />}
      </>
    );
  }

  const {getByRole} = render(<App />);

  fireEvent.click(getByRole('button'));

  expect(spy.mock.calls[0][0]).toBe(false);

  await act(async () => {});

  expect(spy.mock.calls[1][0]).toBe(true);

  fireEvent.click(getByRole('button'));

  expect(spy.mock.calls[2][0]).toBe(false);

  fireEvent.click(getByRole('button'));
  await act(async () => {});

  expect(spy.mock.calls[3][0]).toBe(true);

  fireEvent.click(getByRole('button'));
  expect(spy.mock.calls[4][0]).toBe(false);
});

test('external elements sync', async () => {
  function App() {
    const [referenceEl, setReferenceEl] = useState<HTMLElement | null>(null);
    const [floatingEl, setFloatingEl] = useState<HTMLElement | null>(null);
    const {x, y, refs} = useFloating();

    useLayoutEffect(() => {
      refs.setReference(referenceEl);
    }, [refs, referenceEl]);

    useLayoutEffect(() => {
      refs.setFloating(floatingEl);
    }, [refs, floatingEl]);

    return (
      <>
        <div ref={setReferenceEl} />
        <div ref={setFloatingEl} />
        <div data-testid="value">{`${x},${y}`}</div>
      </>
    );
  }

  const {getByTestId} = render(<App />);

  await act(async () => {});

  expect(getByTestId('value').textContent).toBe('0,0');
});
