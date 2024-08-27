import type {MutableRefObject} from 'react';
import {useEffect, useRef} from 'react';

export const useResize = (
  ref: MutableRefObject<Element | null>,
  callback: ResizeObserverCallback,
) => {
  const callbackRef = useRef<ResizeObserverCallback | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    let cleanup;
    if (typeof ResizeObserver === 'function') {
      const el = ref.current;
      const observer = new ResizeObserver(
        (entries, observer) => callbackRef.current?.(entries, observer),
      );
      el && observer.observe(el);
      cleanup = () => {
        el && observer.unobserve(el);
      };
    }
    return cleanup;
  }, [ref, callback]);
};
