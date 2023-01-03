import * as React from 'react';
import useLayoutEffect from 'use-isomorphic-layout-effect';

import type {FloatingContext, ReferenceType, Side} from '../types';
import {useLatestRef} from './utils/useLatestRef';

function useDelayUnmount(open: boolean, durationMs: number): boolean {
  const [isMounted, setIsMounted] = React.useState(open);

  if (open && !isMounted) {
    setIsMounted(true);
  }

  React.useEffect(() => {
    if (!open) {
      const timeout = setTimeout(() => setIsMounted(false), durationMs);
      return () => clearTimeout(timeout);
    }
  }, [open, durationMs]);

  return isMounted;
}

type CSSStylesProperty =
  | React.CSSProperties
  | ((side: Side) => React.CSSProperties);

export interface Props {
  from?: CSSStylesProperty;
  to?: CSSStylesProperty;
  exit?: CSSStylesProperty;
  duration?: number | Partial<{open: number; close: number}>;
}

export function useCSSTransition<RT extends ReferenceType = ReferenceType>(
  {placement, open, refs}: FloatingContext<RT>,
  {
    from: unstable_from = {opacity: 0},
    to: unstable_to,
    exit: unstable_exit,
    duration = 250,
  }: Props = {}
): {
  isMounted: boolean;
  styles: React.CSSProperties;
} {
  const side = placement.split('-')[0] as Side;
  const isNumberDuration = typeof duration === 'number';
  const openDuration = (isNumberDuration ? duration : duration.open) || 0;
  const closeDuration = (isNumberDuration ? duration : duration.close) || 0;

  const [initiated, setInitiated] = React.useState(false);
  const [styles, setStyles] = React.useState<React.CSSProperties>({});
  const isMounted = useDelayUnmount(open, closeDuration);

  // `initiated` check prevents this `setState` call from breaking
  // <FloatingPortal />. This call is necessary to ensure subsequent opens after
  // the initial one allows the correct side animation to play when the
  // placement has changed.
  if (initiated && !isMounted && Object.keys(styles).length !== 0) {
    setStyles({});
  }

  const fromRef = useLatestRef(unstable_from);
  const toRef = useLatestRef(unstable_to);
  const exitRef = useLatestRef(unstable_exit);

  useLayoutEffect(() => {
    const el = refs.floating.current;
    if (!el) return;

    const from = fromRef.current;
    const exit = exitRef.current;
    const to = toRef.current;

    const fromValue = typeof from === 'function' ? from(side) : from;
    const exitValue = typeof exit === 'function' ? exit(side) : exit;
    const toWithFallback =
      to ||
      (() =>
        Object.keys(fromValue).reduce((acc: Record<string, ''>, key) => {
          acc[key] = '';
          return acc;
        }, {}));

    setStyles((styles) => ({
      // Preserve transition properties
      ...styles,
      ...fromValue,
    }));

    if (open) {
      const frame = requestAnimationFrame(() => {
        const toValue =
          typeof toWithFallback === 'function'
            ? toWithFallback(side)
            : toWithFallback;
        setStyles({
          transitionProperty: Object.keys(toValue).join(','),
          transitionDuration: `${openDuration}ms`,
          ...toValue,
        });
      });

      return () => {
        cancelAnimationFrame(frame);
      };
    } else {
      setInitiated(true);
      const value = exitValue || fromValue;
      setStyles({
        transitionProperty: Object.keys(value).join(','),
        transitionDuration: `${closeDuration}ms`,
        ...value,
      });
    }
  }, [
    open,
    refs,
    placement,
    side,
    openDuration,
    closeDuration,
    fromRef,
    exitRef,
    toRef,
  ]);

  return {
    isMounted,
    styles,
  };
}
