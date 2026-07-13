import * as React from 'react';
import useClientLayoutEffect from 'use-isomorphic-layout-effect';
import {SafeReact} from './safeReact';

export {useClientLayoutEffect};

export function useLatestRef<T>(value: T) {
  const ref = React.useRef<T>(value);
  useClientLayoutEffect(() => {
    ref.current = value;
  });
  return ref;
}

type AnyFunction = (...args: any[]) => any;

const useInsertionEffect = SafeReact.useInsertionEffect as
  | AnyFunction
  | undefined;

const useSafeInsertionEffect = useInsertionEffect || ((fn) => fn());

export function useEffectEvent<T extends AnyFunction>(callback?: T) {
  const ref = React.useRef<AnyFunction | undefined>(() => {
    if (__DEV__) {
      throw new Error('Cannot call an event handler while rendering.');
    }
  });

  useSafeInsertionEffect(() => {
    ref.current = callback;
  });

  return React.useCallback<AnyFunction>(
    (...args) => ref.current?.(...args),
    [],
  ) as T;
}
