import * as React from 'react';
import useModernLayoutEffect from 'use-isomorphic-layout-effect';

const SafeReact = {...React} as typeof React;
// Insertion effects run before any layout effect in the commit, including
// children's, so they never read the previous render's value. React <18 falls
// back to a layout effect: writing during render would publish values from a
// render that suspends and never commits.
const useInsertionEffect =
  SafeReact.useInsertionEffect || useModernLayoutEffect;

export function useLatestRef<T>(value: T) {
  const ref = React.useRef(value);
  useInsertionEffect(() => {
    ref.current = value;
  });
  return ref;
}
