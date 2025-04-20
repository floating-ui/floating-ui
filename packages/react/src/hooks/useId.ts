import * as React from 'react';
import {useModernLayoutEffect} from '@floating-ui/react/utils';

import {SafeReact} from '../utils/safeReact';

let serverHandoffComplete = false;
let count = 0;
const genId = () =>
  // Ensure the id is unique with multiple independent versions of Floating UI
  // on <React 18
  `floating-ui-${Math.random().toString(36).slice(2, 6)}${count++}`;

function useFloatingId(): string | undefined {
  const [id, setId] = React.useState(() =>
    serverHandoffComplete ? genId() : undefined,
  );

  useModernLayoutEffect(() => {
    if (id == null) {
      setId(genId());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    serverHandoffComplete = true;
  }, []);

  return id;
}

const useReactId = SafeReact.useId as () => string | undefined;

/**
 * Uses React 18's built-in `useId()` when available, or falls back to a
 * slightly less performant (requiring a double render) implementation for
 * earlier React versions.
 * @see https://floating-ui.com/docs/react-utils#useid
 */
export const useId = useReactId || useFloatingId;
