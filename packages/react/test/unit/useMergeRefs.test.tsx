import {render} from '@testing-library/react';
import * as React from 'react';
import {vi} from 'vitest';

import {useMergeRefs} from '../../src/hooks/useMergeRefs';

test('merges refs and cleans up', () => {
  const callbackSpy = vi.fn();
  let refSpy: HTMLElement | null = null;

  function App({show}: {show: boolean}) {
    const ref1 = React.useRef<HTMLDivElement>(null);
    const ref2 = React.useCallback(callbackSpy, []);
    const ref = useMergeRefs([ref1, ref2]);

    React.useLayoutEffect(() => {
      refSpy = ref1.current;
    }, [show]);

    return show ? <div id="test" ref={ref} /> : null;
  }

  const {rerender} = render(<App show />);

  // @ts-expect-error
  expect(refSpy?.id).toBe('test');
  expect(callbackSpy.mock.calls[0][0]?.id).toBe('test');
  callbackSpy.mockReset();

  rerender(<App show={false} />);

  expect(refSpy).toBe(null);
  expect(callbackSpy.mock.calls[0][0]).toBe(null);
});

test('conditional refs', () => {
  const callbackSpy = vi.fn();
  const callbackSpy2 = vi.fn();
  const callbackSpy3 = vi.fn();

  function App({change}: {change: boolean}) {
    const ref1 = React.useCallback(callbackSpy, []);
    const ref2 = React.useCallback(callbackSpy2, []);
    const ref3 = React.useCallback(callbackSpy3, []);
    const ref = useMergeRefs([ref1, change ? ref3 : ref2]);

    return <div id="test" ref={ref} />;
  }

  const {rerender} = render(<App change={false} />);

  expect(callbackSpy.mock.calls[0][0]?.id).toBe('test');
  expect(callbackSpy2.mock.calls[0][0]?.id).toBe('test');
  expect(callbackSpy3.mock.calls.length).toBe(0);
  callbackSpy.mockReset();
  callbackSpy2.mockReset();

  rerender(<App change={true} />);

  expect(callbackSpy.mock.calls[0][0]).toBe(null);
  expect(callbackSpy2.mock.calls[0][0]).toBe(null);
  expect(callbackSpy.mock.calls[1][0]?.id).toBe('test');
  expect(callbackSpy2.mock.calls.length).toBe(1);
  expect(callbackSpy3.mock.calls[0][0]?.id).toBe('test');
});

test('calls clean up function if it exists', () => {
  const cleanUp = vi.fn();
  const setup = vi.fn();
  const setup2 = vi.fn();
  const nullHandler = vi.fn();

  function onRefChangeWithCleanup(ref: HTMLDivElement | null) {
    if (ref) {
      setup(ref.id);
    } else {
      nullHandler();
    }
    return cleanUp;
  }

  function onRefChangeWithoutCleanup(ref: HTMLDivElement | null) {
    if (ref) {
      setup2(ref.id);
    } else {
      nullHandler();
    }
  }

  function App() {
    const ref = useMergeRefs([
      onRefChangeWithCleanup,
      onRefChangeWithoutCleanup,
    ]);
    return <div id="test" ref={ref} />;
  }

  const {unmount} = render(<App />);

  expect(setup).toHaveBeenCalledWith('test');
  expect(setup).toHaveBeenCalledTimes(1);
  expect(cleanUp).toHaveBeenCalledTimes(0);

  expect(setup2).toHaveBeenCalledWith('test');
  expect(setup2).toHaveBeenCalledTimes(1);

  unmount();

  expect(setup).toHaveBeenCalledTimes(1);
  expect(cleanUp).toHaveBeenCalledTimes(1);

  // Setup was not called again
  expect(setup2).toHaveBeenCalledTimes(1);
  // Null handler hit because no cleanup is returned
  expect(nullHandler).toHaveBeenCalledTimes(1);
});
