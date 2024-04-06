import * as React from 'react';
import useModernLayoutEffect from 'use-isomorphic-layout-effect';

let serverHandoffComplete = false;
let count = 0;
const genId = () => `floating-ui-${count++}`;

function useFloatingId() {
  const [id, setId] = React.useState(() =>
    serverHandoffComplete ? genId() : undefined,
  );

  useModernLayoutEffect(() => {
    if (id == null) {
      setId(genId());
    }
  }, []);

  React.useEffect(() => {
    if (!serverHandoffComplete) {
      serverHandoffComplete = true;
    }
  }, []);

  return id;
}

// Prevent bundlers from trying to `import { useId } from 'react'`
const useReactId = React[
  `useId${Math.random()}`.slice(0, 5) as 'useId'
] as () => string;

/**
 * Uses React 18's built-in `useId()` when available, or falls back to a
 * slightly less performant (requiring a double render) implementation for
 * earlier React versions.
 * @see https://floating-ui.com/docs/react-utils#useid
 */
export const useId = useReactId || useFloatingId;
