import * as React from 'react';
import useLayoutEffect from 'use-isomorphic-layout-effect';

import {getDelay} from '../hooks/useHover';
import type {FloatingContext} from '../types';

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
  setCurrentId: () => {},
  setState: () => {},
  isInstantPhase: false,
});

export const useDelayGroupContext = (): GroupContext =>
  React.useContext(FloatingDelayGroupContext);

interface FloatingDelayGroupProps {
  children?: React.ReactNode;
  delay: Delay;
  timeoutMs?: number;
}

/**
 * Provides context for a group of floating elements that should share a
 * `delay`.
 * @see https://floating-ui.com/docs/FloatingDelayGroup
 */
export const FloatingDelayGroup = ({
  children,
  delay,
  timeoutMs = 0,
}: FloatingDelayGroupProps): JSX.Element => {
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
    }
  );

  const initialCurrentIdRef = React.useRef<any>(null);

  const setCurrentId = React.useCallback((currentId: any) => {
    setState({currentId});
  }, []);

  useLayoutEffect(() => {
    if (state.currentId) {
      if (initialCurrentIdRef.current === null) {
        initialCurrentIdRef.current = state.currentId;
      } else {
        setState({isInstantPhase: true});
      }
    } else {
      setState({isInstantPhase: false});
      initialCurrentIdRef.current = null;
    }
  }, [state.currentId]);

  return (
    <FloatingDelayGroupContext.Provider
      value={React.useMemo(
        () => ({...state, setState, setCurrentId}),
        [state, setState, setCurrentId]
      )}
    >
      {children}
    </FloatingDelayGroupContext.Provider>
  );
};

interface UseGroupOptions {
  id: any;
}

export const useDelayGroup = (
  {open, onOpenChange}: FloatingContext,
  {id}: UseGroupOptions
) => {
  const {currentId, setCurrentId, initialDelay, setState, timeoutMs} =
    useDelayGroupContext();

  useLayoutEffect(() => {
    if (currentId) {
      setState({
        delay: {
          open: 1,
          close: getDelay(initialDelay, 'close'),
        },
      });

      if (currentId !== id) {
        onOpenChange(false);
      }
    }
  }, [id, onOpenChange, setState, currentId, initialDelay]);

  useLayoutEffect(() => {
    function unset() {
      onOpenChange(false);
      setState({delay: initialDelay, currentId: null});
    }

    if (!open && currentId === id) {
      if (timeoutMs) {
        const timeout = window.setTimeout(unset, timeoutMs);
        return () => {
          clearTimeout(timeout);
        };
      } else {
        unset();
      }
    }
  }, [open, setState, currentId, id, onOpenChange, initialDelay, timeoutMs]);

  useLayoutEffect(() => {
    if (open) {
      setCurrentId(id);
    }
  }, [open, setCurrentId, id]);
};
