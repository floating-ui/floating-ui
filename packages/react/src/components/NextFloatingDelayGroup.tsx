import * as React from 'react';
import {useModernLayoutEffect} from '@floating-ui/react/utils';

import {getDelay} from '../hooks/useHover';
import type {FloatingRootContext, Delay} from '../types';
import {clearTimeoutIfSet} from '../utils/clearTimeoutIfSet';

interface ContextValue {
  hasProvider: boolean;
  timeoutMs: number;
  delayRef: React.MutableRefObject<Delay>;
  initialDelayRef: React.MutableRefObject<Delay>;
  timeoutIdRef: React.MutableRefObject<number>;
  currentIdRef: React.MutableRefObject<any>;
  currentContextRef: React.MutableRefObject<{
    onOpenChange: (open: boolean) => void;
    setIsInstantPhase: (value: boolean) => void;
  } | null>;
}

const NextFloatingDelayGroupContext = React.createContext<ContextValue>({
  hasProvider: false,
  timeoutMs: 0,
  delayRef: {current: 0},
  initialDelayRef: {current: 0},
  timeoutIdRef: {current: -1},
  currentIdRef: {current: null},
  currentContextRef: {current: null},
});

export interface NextFloatingDelayGroupProps {
  children?: React.ReactNode;
  /**
   * The delay to use for the group when it's not in the instant phase.
   */
  delay: Delay;
  /**
   * An optional explicit timeout to use for the group, which represents when
   * grouping logic will no longer be active after the close delay completes.
   * This is useful if you want grouping to “last” longer than the close delay,
   * for example if there is no close delay at all.
   */
  timeoutMs?: number;
}

/**
 * Experimental next version of `FloatingDelayGroup` to become the default
 * in the future. This component is not yet stable.
 * Provides context for a group of floating elements that should share a
 * `delay`. Unlike `FloatingDelayGroup`, `useNextDelayGroup` with this
 * component does not cause a re-render of unrelated consumers of the
 * context when the delay changes.
 * @see https://floating-ui.com/docs/FloatingDelayGroup
 */
export function NextFloatingDelayGroup(
  props: NextFloatingDelayGroupProps,
): React.JSX.Element {
  const {children, delay, timeoutMs = 0} = props;

  const delayRef = React.useRef(delay);
  const initialDelayRef = React.useRef(delay);
  const currentIdRef = React.useRef<string | null>(null);
  const currentContextRef = React.useRef(null);
  const timeoutIdRef = React.useRef(-1);

  return (
    <NextFloatingDelayGroupContext.Provider
      value={React.useMemo(
        () => ({
          hasProvider: true,
          delayRef,
          initialDelayRef,
          currentIdRef,
          timeoutMs,
          currentContextRef,
          timeoutIdRef,
        }),
        [timeoutMs],
      )}
    >
      {children}
    </NextFloatingDelayGroupContext.Provider>
  );
}

interface UseNextDelayGroupOptions {
  /**
   * Whether delay grouping should be enabled.
   * @default true
   */
  enabled?: boolean;
}

interface UseNextDelayGroupReturn {
  /**
   * The delay reference object.
   */
  delayRef: React.MutableRefObject<Delay>;
  /**
   * Whether animations should be removed.
   */
  isInstantPhase: boolean;
  /**
   * Whether a `<NextFloatingDelayGroup>` provider is present.
   */
  hasProvider: boolean;
}

/**
 * Enables grouping when called inside a component that's a child of a
 * `NextFloatingDelayGroup`.
 * @see https://floating-ui.com/docs/FloatingDelayGroup
 */
export function useNextDelayGroup(
  context: FloatingRootContext,
  options: UseNextDelayGroupOptions = {},
): UseNextDelayGroupReturn {
  const {open, onOpenChange, floatingId} = context;
  const {enabled = true} = options;

  const groupContext = React.useContext(NextFloatingDelayGroupContext);
  const {
    currentIdRef,
    delayRef,
    timeoutMs,
    initialDelayRef,
    currentContextRef,
    hasProvider,
    timeoutIdRef,
  } = groupContext;

  const [isInstantPhase, setIsInstantPhase] = React.useState(false);

  useModernLayoutEffect(() => {
    function unset() {
      setIsInstantPhase(false);
      currentContextRef.current?.setIsInstantPhase(false);
      currentIdRef.current = null;
      currentContextRef.current = null;
      delayRef.current = initialDelayRef.current;
    }

    if (!enabled) return;
    if (!currentIdRef.current) return;

    if (!open && currentIdRef.current === floatingId) {
      setIsInstantPhase(false);

      if (timeoutMs) {
        timeoutIdRef.current = window.setTimeout(unset, timeoutMs);
        return () => {
          clearTimeout(timeoutIdRef.current);
        };
      }

      unset();
    }
  }, [
    enabled,
    open,
    floatingId,
    currentIdRef,
    delayRef,
    timeoutMs,
    initialDelayRef,
    currentContextRef,
    timeoutIdRef,
  ]);

  useModernLayoutEffect(() => {
    if (!enabled) return;
    if (!open) return;

    const prevContext = currentContextRef.current;
    const prevId = currentIdRef.current;

    currentContextRef.current = {onOpenChange, setIsInstantPhase};
    currentIdRef.current = floatingId;
    delayRef.current = {
      open: 0,
      close: getDelay(initialDelayRef.current, 'close'),
    };

    if (prevId !== null && prevId !== floatingId) {
      clearTimeoutIfSet(timeoutIdRef);
      setIsInstantPhase(true);
      prevContext?.setIsInstantPhase(true);
      prevContext?.onOpenChange(false);
    } else {
      setIsInstantPhase(false);
      prevContext?.setIsInstantPhase(false);
    }
  }, [
    enabled,
    open,
    floatingId,
    onOpenChange,
    currentIdRef,
    delayRef,
    timeoutMs,
    initialDelayRef,
    currentContextRef,
    timeoutIdRef,
  ]);

  useModernLayoutEffect(() => {
    return () => {
      currentContextRef.current = null;
    };
  }, [currentContextRef]);

  return React.useMemo(
    () => ({
      hasProvider,
      delayRef,
      isInstantPhase,
    }),
    [hasProvider, delayRef, isInstantPhase],
  );
}
