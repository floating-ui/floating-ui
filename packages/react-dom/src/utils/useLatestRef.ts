import * as React from 'react';
import useClientLayoutEffect from 'use-isomorphic-layout-effect';

export function useLatestRef<T>(value: T) {
  const ref = React.useRef(value);
  useClientLayoutEffect(() => {
    ref.current = value;
  });
  return ref;
}
