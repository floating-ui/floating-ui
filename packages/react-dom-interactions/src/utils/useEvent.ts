import * as React from 'react';
import {useInsertionEffect as _useInsertionEffect} from 'react';

const useInsertionEffect =
  typeof _useInsertionEffect === 'function' ? _useInsertionEffect : undefined;

type AnyFunction = (...args: any[]) => any;

export function useEvent<T extends AnyFunction>(callback?: T) {
  const ref = React.useRef<AnyFunction | undefined>(() => {
    if (__DEV__) {
      throw new Error('Cannot call an event handler while rendering.');
    }
  });

  if (useInsertionEffect) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useInsertionEffect(() => {
      ref.current = callback;
    });
  } else {
    ref.current = callback;
  }

  return React.useCallback<AnyFunction>(
    (...args) => ref.current?.(...args),
    []
  ) as T;
}
