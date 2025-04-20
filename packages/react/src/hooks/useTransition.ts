import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {useLatestRef, useModernLayoutEffect} from '@floating-ui/react/utils';

import type {FloatingContext, Placement, ReferenceType, Side} from '../types';

type Duration = number | {open?: number; close?: number};

// Converts a JS style key like `backgroundColor` to a CSS transition-property
// like `background-color`.
const camelCaseToKebabCase = (str: string): string =>
  str.replace(
    /[A-Z]+(?![a-z])|[A-Z]/g,
    ($, ofs) => (ofs ? '-' : '') + $.toLowerCase(),
  );

function execWithArgsOrReturn<Value extends object | undefined, SidePlacement>(
  valueOrFn: Value | ((args: SidePlacement) => Value),
  args: SidePlacement,
): Value {
  return typeof valueOrFn === 'function' ? valueOrFn(args) : valueOrFn;
}

function useDelayUnmount(open: boolean, durationMs: number): boolean {
  const [isMounted, setIsMounted] = React.useState(open);

  if (open && !isMounted) {
    setIsMounted(true);
  }

  React.useEffect(() => {
    if (!open && isMounted) {
      const timeout = setTimeout(() => setIsMounted(false), durationMs);
      return () => clearTimeout(timeout);
    }
  }, [open, isMounted, durationMs]);

  return isMounted;
}

export interface UseTransitionStatusProps {
  /**
   * The duration of the transition in milliseconds, or an object containing
   * `open` and `close` keys for different durations.
   */
  duration?: Duration;
}

type TransitionStatus = 'unmounted' | 'initial' | 'open' | 'close';

/**
 * Provides a status string to apply CSS transitions to a floating element,
 * correctly handling placement-aware transitions.
 * @see https://floating-ui.com/docs/useTransition#usetransitionstatus
 */
export function useTransitionStatus(
  context: FloatingContext,
  props: UseTransitionStatusProps = {},
): {
  isMounted: boolean;
  status: TransitionStatus;
} {
  const {
    open,
    elements: {floating},
  } = context;
  const {duration = 250} = props;

  const isNumberDuration = typeof duration === 'number';
  const closeDuration = (isNumberDuration ? duration : duration.close) || 0;

  const [status, setStatus] = React.useState<TransitionStatus>('unmounted');
  const isMounted = useDelayUnmount(open, closeDuration);

  if (!isMounted && status === 'close') {
    setStatus('unmounted');
  }

  useModernLayoutEffect(() => {
    if (!floating) return;

    if (open) {
      setStatus('initial');

      const frame = requestAnimationFrame(() => {
        // Ensure it opens before paint. With `FloatingDelayGroup`,
        // this avoids a flicker when moving between floating elements
        // to ensure one is always open with no missing frames.
        ReactDOM.flushSync(() => {
          setStatus('open');
        });
      });

      return () => {
        cancelAnimationFrame(frame);
      };
    }

    setStatus('close');
  }, [open, floating]);

  return {
    isMounted,
    status,
  };
}

type CSSStylesProperty =
  | React.CSSProperties
  | ((params: {side: Side; placement: Placement}) => React.CSSProperties);

export interface UseTransitionStylesProps extends UseTransitionStatusProps {
  /**
   * The styles to apply when the floating element is initially mounted.
   */
  initial?: CSSStylesProperty;
  /**
   * The styles to apply when the floating element is transitioning to the
   * `open` state.
   */
  open?: CSSStylesProperty;
  /**
   * The styles to apply when the floating element is transitioning to the
   * `close` state.
   */
  close?: CSSStylesProperty;
  /**
   * The styles to apply to all states.
   */
  common?: CSSStylesProperty;
}

/**
 * Provides styles to apply CSS transitions to a floating element, correctly
 * handling placement-aware transitions. Wrapper around `useTransitionStatus`.
 * @see https://floating-ui.com/docs/useTransition#usetransitionstyles
 */
export function useTransitionStyles<RT extends ReferenceType = ReferenceType>(
  context: FloatingContext<RT>,
  props: UseTransitionStylesProps = {},
): {
  isMounted: boolean;
  styles: React.CSSProperties;
} {
  const {
    initial: unstable_initial = {opacity: 0},
    open: unstable_open,
    close: unstable_close,
    common: unstable_common,
    duration = 250,
  } = props;

  const placement = context.placement;
  const side = placement.split('-')[0] as Side;
  const fnArgs = React.useMemo(() => ({side, placement}), [side, placement]);
  const isNumberDuration = typeof duration === 'number';
  const openDuration = (isNumberDuration ? duration : duration.open) || 0;
  const closeDuration = (isNumberDuration ? duration : duration.close) || 0;

  const [styles, setStyles] = React.useState<React.CSSProperties>(() => ({
    ...execWithArgsOrReturn(unstable_common, fnArgs),
    ...execWithArgsOrReturn(unstable_initial, fnArgs),
  }));

  const {isMounted, status} = useTransitionStatus(context, {duration});
  const initialRef = useLatestRef(unstable_initial);
  const openRef = useLatestRef(unstable_open);
  const closeRef = useLatestRef(unstable_close);
  const commonRef = useLatestRef(unstable_common);

  useModernLayoutEffect(() => {
    const initialStyles = execWithArgsOrReturn(initialRef.current, fnArgs);
    const closeStyles = execWithArgsOrReturn(closeRef.current, fnArgs);
    const commonStyles = execWithArgsOrReturn(commonRef.current, fnArgs);
    const openStyles =
      execWithArgsOrReturn(openRef.current, fnArgs) ||
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
    closeDuration,
    closeRef,
    initialRef,
    openRef,
    commonRef,
    openDuration,
    status,
    fnArgs,
  ]);

  return {
    isMounted,
    styles,
  };
}
