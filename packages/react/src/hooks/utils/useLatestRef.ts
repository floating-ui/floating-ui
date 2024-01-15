import {useRef} from 'react';
import useModernLayoutEffect from 'use-isomorphic-layout-effect';

export function useLatestRef<T>(value: T) {
  const ref = useRef<T>(value);
  useModernLayoutEffect(() => {
    ref.current = value;
  });
  return ref;
}
