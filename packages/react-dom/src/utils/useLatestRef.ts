import * as React from 'react';
import {useModernLayoutEffect} from './useModernLayoutEffect';

export function useLatestRef<T>(value: T) {
  const ref = React.useRef(value);
  useModernLayoutEffect(() => {
    ref.current = value;
  });
  return ref;
}
