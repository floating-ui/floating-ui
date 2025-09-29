import * as React from 'react';

export function useLiteMergeRefs<T>(
  refs: Array<React.MutableRefObject<T | null> | undefined>,
): React.RefCallback<T> {
  return React.useMemo(() => {
    return (value) => {
      refs.forEach((ref) => {
        if (ref) {
          ref.current = value;
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs);
}
