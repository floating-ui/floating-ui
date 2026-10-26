import * as React from 'react';

const SafeReact = {...React} as typeof React;
// Runs before any layout effect in the commit, including children's, so they
// never read the previous render's value. React <18 renders synchronously, so
// writing during render is safe there.
const useInsertionEffect =
  SafeReact.useInsertionEffect || ((fn: () => void) => fn());

export function useLatestRef<T>(value: T) {
  const ref = React.useRef(value);
  useInsertionEffect(() => {
    ref.current = value;
  });
  return ref;
}
