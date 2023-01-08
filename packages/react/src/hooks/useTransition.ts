import * as React from 'react';
import useLayoutEffect from 'use-isomorphic-layout-effect';

import type {FloatingContext, Placement, ReferenceType, Side} from '../types';
import {useLatestRef} from './utils/useLatestRef';

// Converts a JS style key like `backgroundColor` to a CSS transition-property
// like `background-color`.
const camelCaseToKebabCase = (str: string): string =>
  str.replace(
    /[A-Z]+(?![a-z])|[A-Z]/g,
    ($, ofs) => (ofs ? '-' : '') + $.toLowerCase()
  );

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

export interface Props {
  duration?: number | Partial<{open: number; close: number}>;
}

type Status = 'unmounted' | 'initial' | 'open' | 'close';

/**
 * Provides a status string to apply CSS transitions to a floating element,
 * correctly handling placement-aware transitions.
 * @see https://floating-ui.com/docs/useTransition#usetransitionstatus
 */
export function useTransitionStatus<RT extends ReferenceType = ReferenceType>(
  {open, elements: {floating}}: FloatingContext<RT>,
  {duration = 250}: Props = {}
): {
  isMounted: boolean;
  status: Status;
} {
  const isNumberDuration = typeof duration === 'number';
  const closeDuration = (isNumberDuration ? duration : duration.close) || 0;

  const [initiated, setInitiated] = React.useState(false);
  const [status, setStatus] = React.useState<Status>('unmounted');
  const isMounted = useDelayUnmount(open, closeDuration);

  // `initiated` check prevents this `setState` call from breaking
  // <FloatingPortal />. This call is necessary to ensure subsequent opens
  // after the initial one allows the correct side animation to play when the
  // placement has changed.
  if (initiated && !isMounted && status !== 'unmounted') {
    setStatus('unmounted');
  }

  useLayoutEffect(() => {
    if (!floating) return;

    if (open) {
      setStatus('initial');

      const frame = requestAnimationFrame(() => {
        setStatus('open');
      });

      return () => {
        cancelAnimationFrame(frame);
      };
    } else {
      setInitiated(true);
      setStatus('close');
    }
  }, [open, floating]);

  return {
    isMounted,
    status,
  };
}

type CSSStylesProperty =
  | React.CSSProperties
  | ((params: {side: Side; placement: Placement}) => React.CSSProperties);

export interface UseTransitionStylesProps extends Props {
  initial?: CSSStylesProperty;
  open?: CSSStylesProperty;
  close?: CSSStylesProperty;
  common?: CSSStylesProperty;
}

/**
 * Provides styles to apply CSS transitions to a floating element, correctly
 * handling placement-aware transitions. Wrapper around `useTransitionStatus`.
 * @see https://floating-ui.com/docs/useTransition#usetransitionstyles
 */
export function useTransitionStyles<RT extends ReferenceType = ReferenceType>(
  context: FloatingContext<RT>,
  {
    initial: unstable_initial = {opacity: 0},
    open: unstable_open,
    close: unstable_close,
    common: unstable_common,
    duration = 250,
  }: UseTransitionStylesProps = {}
): {
  isMounted: boolean;
  styles: React.CSSProperties;
} {
  const placement = context.placement;
  const side = placement.split('-')[0] as Side;
  const [styles, setStyles] = React.useState<React.CSSProperties>({});
  const {isMounted, status} = useTransitionStatus(context, {duration});

  const initialRef = useLatestRef(unstable_initial);
  const openRef = useLatestRef(unstable_open);
  const closeRef = useLatestRef(unstable_close);
  const commonRef = useLatestRef(unstable_common);

  const isNumberDuration = typeof duration === 'number';
  const openDuration = (isNumberDuration ? duration : duration.open) || 0;
  const closeDuration = (isNumberDuration ? duration : duration.close) || 0;

  useLayoutEffect(() => {
    const fnArgs = {side, placement};

    const initial = initialRef.current;
    const close = closeRef.current;
    const open = openRef.current;
    const common = commonRef.current;

    const initialStyles =
      typeof initial === 'function' ? initial(fnArgs) : initial;
    const closeStyles = typeof close === 'function' ? close(fnArgs) : close;
    const commonStyles = typeof common === 'function' ? common(fnArgs) : common;
    const openStyles =
      (typeof open === 'function' ? open(fnArgs) : open) ||
      Object.keys(initialStyles).reduce((acc: Record<string, ''>, key) => {
        acc[key] = '';
        return acc;
      }, {});

    if (status === 'initial') {
      setStyles((styles) => ({
        transitionProperty: styles.transitionProperty,
        ...commonStyles,
        ...initialStyles,
      }));
    }

    if (status === 'open') {
      setStyles({
        transitionProperty: Object.keys(openStyles)
          .map(camelCaseToKebabCase)
          .join(','),
        transitionDuration: `${openDuration}ms`,
        ...commonStyles,
        ...openStyles,
      });
    }

    if (status === 'close') {
      const styles = closeStyles || initialStyles;
      setStyles({
        transitionProperty: Object.keys(styles)
          .map(camelCaseToKebabCase)
          .join(','),
        transitionDuration: `${closeDuration}ms`,
        ...commonStyles,
        ...styles,
      });
    }
  }, [
    side,
    placement,
    closeDuration,
    closeRef,
    initialRef,
    openRef,
    commonRef,
    openDuration,
    status,
  ]);

  return {
    isMounted,
    styles,
  };
}
