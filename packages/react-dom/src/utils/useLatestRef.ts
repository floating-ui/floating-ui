import {useRef} from 'react';
import useIsomorphicLayoutEffect from 'use-isomorphic-layout-effect';

/**
 * @see https://epicreact.dev/the-latest-ref-pattern-in-react/
 */
export function useLatestRef<Value>(value: Value) {
  const ref = useRef(value);

  useIsomorphicLayoutEffect(() => {
    ref.current = value;
  });

  return ref;
}
