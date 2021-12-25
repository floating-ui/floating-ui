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
import {renderHook} from '@testing-library/react-hooks';
import {render, waitFor, fireEvent} from '@testing-library/react';
import {useRef, useState} from 'react';
import type {Dimensions, ElementRects} from '@floating-ui/core';

test('`x` and `y` are initially `null`', async () => {
  const {result} = renderHook(() => useFloating());

  expect(result.current.x).toBe(null);
  expect(result.current.y).toBe(null);
});

test('middleware is always fresh and does not cause an infinite loop', async () => {
  function InlineMiddleware() {
    const [sizeData, setSizeData] = useState<
      (ElementRects & Dimensions) | null
    >(null);
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

        size({apply: setSizeData}),
      ],
    });

    return (
      <>
        <div ref={reference} />
        <div ref={floating} style={{height: sizeData?.height ?? ''}} />
      </>
    );
  }

  function StateMiddleware() {
    const [sizeData, setSizeData] = useState<
      (ElementRects & Dimensions) | null
    >(null);
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

      size({apply: setSizeData}),
    ]);
    const {x, y, reference, floating} = useFloating({
      placement: 'right',
      middleware,
    });

    return (
      <>
        <div ref={reference} />
        <div ref={floating} style={{height: sizeData?.height ?? ''}} />
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

  await waitFor(() => render(<InlineMiddleware />));

  const {getByTestId} = await waitFor(() => render(<StateMiddleware />));
  await waitFor(() => fireEvent.click(getByTestId('step1')));
  await waitFor(() => expect(getByTestId('x').textContent).toBe('10'));

  await waitFor(() => fireEvent.click(getByTestId('step2')));
  await waitFor(() => expect(getByTestId('x').textContent).toBe('5'));

  // No `expect` as this test will fail if a render loop occurs
  await waitFor(() => fireEvent.click(getByTestId('step3')));
  await waitFor(() => fireEvent.click(getByTestId('step4')));
});
