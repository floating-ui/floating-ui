import * as React from 'react';
import useModernLayoutEffect from 'use-isomorphic-layout-effect';

import {getDelay} from '../hooks/useHover';
import type {FloatingRootContext, Delay} from '../types';

interface GroupContext {
  hasProvider: boolean;
  timeoutMs: number;
  delayRef: React.MutableRefObject<Delay>;
  initialDelayRef: React.MutableRefObject<Delay>;
  currentIdRef: React.MutableRefObject<any>;
  currentContextRef: React.MutableRefObject<FloatingRootContext | null>;
  instantPhaseRef: React.MutableRefObject<boolean>;
}

const FloatingDelayGroupContext = React.createContext<GroupContext>({
  hasProvider: false,
  timeoutMs: 0,
  delayRef: {current: 0},
  initialDelayRef: {current: 0},
  currentIdRef: {current: null},
  currentContextRef: {current: null},
  instantPhaseRef: {current: false},
});

export interface FloatingDelayGroupOptimizedProps {
  children?: React.ReactNode;
  /**
   * The delay to use for the group.
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
 * Provides context for a group of floating elements that should share a
 * `delay`.
 * @see https://floating-ui.com/docs/FloatingDelayGroup
 */
export function FloatingDelayGroupOptimized(
  props: FloatingDelayGroupOptimizedProps,
): React.JSX.Element {
  const {children, delay, timeoutMs = 0} = props;

  const delayRef = React.useRef(delay);
  const initialDelayRef = React.useRef(delay);
  const currentIdRef = React.useRef<string | null>(null);
  const currentContextRef = React.useRef<FloatingRootContext | null>(null);
  const instantPhaseRef = React.useRef(false);

  return (
    <FloatingDelayGroupContext.Provider
      value={React.useMemo(
        () => ({
          hasProvider: true,
          delayRef,
          initialDelayRef,
          currentIdRef,
          timeoutMs,
          currentContextRef,
          instantPhaseRef,
        }),
        [timeoutMs],
      )}
    >
      {children}
    </FloatingDelayGroupContext.Provider>
  );
}

interface UseGroupOptions {
  /**
   * Whether delay grouping should be enabled.
   * @default true
   */
  enabled?: boolean;
}

/**
 * Enables grouping when called inside a component that's a child of a
 * `FloatingDelayGroup`. Unlike `useDelayGroup`, this hook does not cause
 * a re-render of all consumers of the context when the delay changes.
 * @see https://floating-ui.com/docs/FloatingDelayGroup
 */
export function useDelayGroupOptimized(
  context: FloatingRootContext,
  options: UseGroupOptions = {},
): GroupContext {
  const {open, onOpenChange, floatingId} = context;
  const {enabled = true} = options;

  const groupContext = React.useContext(FloatingDelayGroupContext);
  const {
    currentIdRef,
    delayRef,
    timeoutMs,
    initialDelayRef,
    currentContextRef,
    instantPhaseRef,
  } = groupContext;

  useModernLayoutEffect(() => {
    function unset() {
      onOpenChange(false);
      currentIdRef.current = null;
      delayRef.current = initialDelayRef.current;
      instantPhaseRef.current = false;
    }

    if (!enabled) return;
    if (!currentIdRef.current) return;

    if (!open && currentIdRef.current === floatingId) {
      if (timeoutMs) {
        const timeout = window.setTimeout(unset, timeoutMs);
        return () => {
          clearTimeout(timeout);
        };
      }

      unset();
    }
  }, [
    enabled,
    open,
    floatingId,
    onOpenChange,
    currentIdRef,
    delayRef,
    instantPhaseRef,
    timeoutMs,
    initialDelayRef,
  ]);

  useModernLayoutEffect(() => {
    if (!enabled) return;
    if (!open) return;

    const prevContext = currentContextRef.current;
    const prevId = currentIdRef.current;

    currentIdRef.current = floatingId;
    delayRef.current = {
      open: 0,
      close: getDelay(initialDelayRef.current, 'close'),
    };

    if (prevId !== null && prevId !== floatingId) {
      instantPhaseRef.current = true;
      prevContext?.onOpenChange(false);
    }
  }, [
    enabled,
    open,
    currentIdRef,
    floatingId,
    delayRef,
    initialDelayRef,
    currentContextRef,
    instantPhaseRef,
  ]);

  useModernLayoutEffect(() => {
    if (!enabled) return;
    if (!open) return;
    currentContextRef.current = context;
    return () => {
      if (currentContextRef.current === context) {
        currentContextRef.current = null;
      }
    };
  }, [enabled, open, currentContextRef, context]);

  useModernLayoutEffect(() => {
    return () => {
      currentContextRef.current = null;
    };
  }, [currentContextRef]);

  return groupContext;
}
