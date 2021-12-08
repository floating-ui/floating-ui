import {useLayoutEffect, useRef} from 'react';

/**
 * @see https://epicreact.dev/the-latest-ref-pattern-in-react/
 */
export function useLatestRef<Value>(value: Value) {
  const ref = useRef(value);

  useLayoutEffect(() => {
    ref.current = value;
  });

  return ref;
}
