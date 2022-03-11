import useLayoutEffect from 'use-isomorphic-layout-effect';
import {useRef} from 'react';

export function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useLayoutEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
