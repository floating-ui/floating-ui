import {
  Accessor,
  createEffect,
  createMemo,
  createSignal,
  JSX,
  mergeProps,
  onCleanup,
} from 'solid-js';
import {createStore} from 'solid-js/store';

import type {FloatingContext, Placement, ReferenceType, Side} from '../types';

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

function useDelayUnmount(
  open: Accessor<boolean>,
  durationMs: number,
): Accessor<boolean> {
  const [isMounted, setIsMounted] = createSignal(open());

  createEffect(() => {
    if (!open()) {
      const timeout = setTimeout(() => setIsMounted(false), durationMs);

      onCleanup(() => clearTimeout(timeout));
    } else {
      setIsMounted(true);
    }
  });

  return isMounted;
}

export interface UseTransitionStatusProps {
  duration?: number | Partial<{open: number; close: number}>;
}

type Status = 'unmounted' | 'initial' | 'open' | 'close';

/**
 * Provides a status string to apply CSS transitions to a floating element,
 * correctly handling placement-aware transitions.
 * @see https://floating-ui.com/docs/useTransition#usetransitionstatus
 */
export function useTransitionStatus<RT extends ReferenceType = ReferenceType>(
  context: Accessor<FloatingContext<RT>>,
  props: UseTransitionStatusProps = {},
): {
  isMounted: Accessor<boolean>;
  status: Accessor<Status>;
} {
  // const {
  //   open,
  // } = context;
  const {duration = 250} = props;

  const isNumberDuration = typeof duration === 'number';
  const closeDuration = (isNumberDuration ? duration : duration.close) || 0;

  const [initiated, setInitiated] = createSignal(false);
  const [status, setStatus] = createSignal<Status>('unmounted');
  const isMounted = useDelayUnmount(context().open, closeDuration);

  // `initiated` check prevents this `setState` call from breaking
  // <FloatingPortal />. This call is necessary to ensure subsequent opens
  // after the initial one allows the correct side animation to play when the
  // placement has changed.
  createEffect(() => {
    if (initiated() && !isMounted()) {
      setStatus('unmounted');
    }
  });

  createEffect(() => {
    if (!context().refs.floating()) return;

    if (context().open()) {
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
  });

  return {
    isMounted,
    status,
  };
}

type CSSStylesProperty =
  | JSX.CSSProperties
  | ((params: {side: Side; placement: Placement}) => JSX.CSSProperties);

export interface UseTransitionStylesProps extends UseTransitionStatusProps {
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
  context: Accessor<FloatingContext<RT>>,
  props: UseTransitionStylesProps = {},
): {
  isMounted: Accessor<boolean>;
  styles: JSX.CSSProperties;
} {
  const mergedProps = mergeProps(
    {
      initial: {opacity: 0},
      duration: 250,
    } as JSX.CSSProperties,
    props,
  ) as Required<UseTransitionStylesProps>;
  const fnArgs = createMemo(() => {
    const placement = context().placement;
    const side = placement.split('-')[0] as Side;
    return {side, placement};
  });

  const durations = createMemo(() => {
    const duration = mergedProps.duration;
    const isNumberDuration = typeof duration === 'number';
    const openDuration = (isNumberDuration ? duration : duration?.open) || 0;
    const closeDuration = (isNumberDuration ? duration : duration?.close) || 0;
    return {openDuration, closeDuration};
  });

  const [styles, setStyles] = createStore<JSX.CSSProperties>({
    // eslint-disable-next-line solid/reactivity
    ...execWithArgsOrReturn(mergedProps.common, fnArgs()),
    // eslint-disable-next-line solid/reactivity
    ...execWithArgsOrReturn(mergedProps.initial, fnArgs()),
  });

  const {isMounted, status} = useTransitionStatus(context, {
    duration: mergedProps.duration,
  });

  createEffect(() => {
    const initialRef = mergedProps.initial;
    const openRef = mergedProps.open;
    const closeRef = mergedProps.close;
    const commonRef = mergedProps.common;
    const initialStyles = execWithArgsOrReturn(initialRef, fnArgs());
    const closeStyles = execWithArgsOrReturn(closeRef, fnArgs());
    const commonStyles = execWithArgsOrReturn(commonRef, fnArgs());
    const openStyles =
      execWithArgsOrReturn(openRef, fnArgs()) ||
      (initialStyles &&
        Object.keys(initialStyles).reduce((acc: Record<string, ''>, key) => {
          acc[key] = '';
          return acc;
        }, {}));

    if (status() === 'initial') {
      setStyles((styles) => ({
        'transition-property': styles['transition-property'],
        ...commonStyles,
        ...initialStyles,
      }));
    }

    if (status() === 'open') {
      setStyles({
        'transition-property':
          openStyles &&
          Object.keys(openStyles).map(camelCaseToKebabCase).join(','),
        'transition-duration': `${durations().openDuration}ms`,
        ...commonStyles,
        ...openStyles,
      });
    }

    if (status() === 'close') {
      const styles = closeStyles || initialStyles;
      setStyles({
        'transition-property':
          styles && Object.keys(styles).map(camelCaseToKebabCase).join(','),
        'transition-duration': `${durations().closeDuration}ms`,
        ...commonStyles,
        ...styles,
      });
    }
  });

  return {
    isMounted,
    styles,
  };
}
