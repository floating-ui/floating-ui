import {useRef} from 'react';
import useLayoutEffect from 'use-isomorphic-layout-effect';

export function useLatestRef<T>(value: T) {
  const ref = useRef<T>(value);
  useLayoutEffect(() => {
    ref.current = value;
  });
  return ref;
}
