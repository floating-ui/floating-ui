import * as React from 'react';
import useLayoutEffect from 'use-isomorphic-layout-effect';

export function useLatestRef<T>(value: T) {
  const ref = React.useRef(value);
  useLayoutEffect(() => {
    ref.current = value;
  });
  return ref;
}
