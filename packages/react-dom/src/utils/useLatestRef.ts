import * as React from 'react';

const SafeReact = {...React} as typeof React;
// Insertion effects run before any layout effect in the commit, including
// children's, so they never read the previous render's value. React <18 has
// none, so write during render instead: a render that suspends can briefly
// publish uncommitted values, but the next render overwrites them.
const useInsertionEffect =
  SafeReact.useInsertionEffect || ((fn: () => void) => fn());

export function useLatestRef<T>(value: T) {
  const ref = React.useRef(value);
  useInsertionEffect(() => {
    ref.current = value;
  });
  return ref;
}
