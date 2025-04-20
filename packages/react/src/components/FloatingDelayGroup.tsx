import * as React from 'react';
import {useModernLayoutEffect} from '@floating-ui/react/utils';

import {getDelay} from '../hooks/useHover';
import type {FloatingRootContext} from '../types';

type Delay = number | Partial<{open: number; close: number}>;

interface GroupState {
  delay: Delay;
  initialDelay: Delay;
  currentId: any;
  timeoutMs: number;
  isInstantPhase: boolean;
}

interface GroupContext extends GroupState {
  setCurrentId: React.Dispatch<React.SetStateAction<any>>;
  setState: React.Dispatch<Partial<GroupState>>;
}

const NOOP = () => {};

const FloatingDelayGroupContext = React.createContext<
  GroupState & {
    setCurrentId: (currentId: any) => void;
    setState: React.Dispatch<Partial<GroupState>>;
  }
>({
  delay: 0,
  initialDelay: 0,
  timeoutMs: 0,
  currentId: null,
  setCurrentId: NOOP,
  setState: NOOP,
  isInstantPhase: false,
});

/**
 * @deprecated
 * Use the return value of `useDelayGroup()` instead.
 */
export const useDelayGroupContext = (): GroupContext =>
  React.useContext(FloatingDelayGroupContext);

export interface FloatingDelayGroupProps {
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
export function FloatingDelayGroup(
  props: FloatingDelayGroupProps,
): React.JSX.Element {
  const {children, delay, timeoutMs = 0} = props;

  const [state, setState] = React.useReducer(
    (prev: GroupState, next: Partial<GroupState>): GroupState => ({
      ...prev,
      ...next,
    }),
    {
      delay,
      timeoutMs,
      initialDelay: delay,
      currentId: null,
      isInstantPhase: false,
    },
  );

  const initialCurrentIdRef = React.useRef<any>(null);

  const setCurrentId = React.useCallback((currentId: any) => {
    setState({currentId});
  }, []);

  useModernLayoutEffect(() => {
    if (state.currentId) {
      if (initialCurrentIdRef.current === null) {
        initialCurrentIdRef.current = state.currentId;
      } else if (!state.isInstantPhase) {
        setState({isInstantPhase: true});
      }
    } else {
      if (state.isInstantPhase) {
        setState({isInstantPhase: false});
      }
      initialCurrentIdRef.current = null;
    }
  }, [state.currentId, state.isInstantPhase]);

  return (
    <FloatingDelayGroupContext.Provider
      value={React.useMemo(
        () => ({...state, setState, setCurrentId}),
        [state, setCurrentId],
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
  id?: any;
}

/**
 * Enables grouping when called inside a component that's a child of a
 * `FloatingDelayGroup`.
 * @see https://floating-ui.com/docs/FloatingDelayGroup
 */
export function useDelayGroup(
  context: FloatingRootContext,
  options: UseGroupOptions = {},
): GroupContext {
  const {open, onOpenChange, floatingId} = context;
  const {id: optionId, enabled = true} = options;
  const id = optionId ?? floatingId;

  const groupContext = useDelayGroupContext();
  const {currentId, setCurrentId, initialDelay, setState, timeoutMs} =
    groupContext;

  useModernLayoutEffect(() => {
    if (!enabled) return;
    if (!currentId) return;

    setState({
      delay: {
        open: 1,
        close: getDelay(initialDelay, 'close'),
      },
    });

    if (currentId !== id) {
      onOpenChange(false);
    }
  }, [enabled, id, onOpenChange, setState, currentId, initialDelay]);

  useModernLayoutEffect(() => {
    function unset() {
      onOpenChange(false);
      setState({delay: initialDelay, currentId: null});
    }

    if (!enabled) return;
    if (!currentId) return;

    if (!open && currentId === id) {
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
    setState,
    currentId,
    id,
    onOpenChange,
    initialDelay,
    timeoutMs,
  ]);

  useModernLayoutEffect(() => {
    if (!enabled) return;
    if (setCurrentId === NOOP || !open) return;
    setCurrentId(id);
  }, [enabled, open, setCurrentId, id]);

  return groupContext;
}
