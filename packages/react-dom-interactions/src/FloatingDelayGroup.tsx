import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  SetStateAction,
  useCallback,
  useMemo,
} from 'react';
import {getDelay} from './hooks/useHover';
import type {FloatingContext} from './types';
import {useLatestRef} from './utils/useLatestRef';

type Delay = number | Partial<{open: number; close: number}>;

interface GroupState {
  delay: Delay;
  initialDelay: Delay;
  currentId: any;
}

interface GroupContext extends GroupState {
  setCurrentId: React.Dispatch<React.SetStateAction<any>>;
  setState: React.Dispatch<React.SetStateAction<GroupState>>;
}

const FloatingDelayGroupContext = createContext<
  GroupState & {
    setCurrentId: (currentId: any) => void;
    setState: React.Dispatch<SetStateAction<GroupState>>;
  }
>({
  delay: 1000,
  initialDelay: 1000,
  currentId: null,
  setCurrentId: () => {},
  setState: () => {},
});

export const useDelayGroupContext = (): GroupContext =>
  useContext(FloatingDelayGroupContext);

/**
 * Provides context for a group of floating elements that should share a
 * `delay`.
 * @see https://floating-ui.com/docs/FloatingDelayGroup
 */
export const FloatingDelayGroup = ({
  children,
  delay,
}: {
  children?: React.ReactNode;
  delay: Delay;
}): JSX.Element => {
  const [state, setState] = useState<GroupState>({
    delay,
    initialDelay: delay,
    currentId: null,
  });

  const setCurrentId = useCallback((currentId: any) => {
    setState((state) => ({...state, currentId}));
  }, []);

  return (
    <FloatingDelayGroupContext.Provider
      value={useMemo(
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
  const {currentId, initialDelay, setState} = useDelayGroupContext();
  const onOpenChangeRef = useLatestRef(onOpenChange);

  useEffect(() => {
    if (currentId && onOpenChangeRef.current) {
      setState((state) => ({
        ...state,
        delay: {open: 1, close: getDelay(initialDelay, 'close')},
      }));

      if (currentId !== id) {
        onOpenChangeRef.current(false);
      }
    }
  }, [id, onOpenChangeRef, setState, currentId, initialDelay]);

  useEffect(() => {
    if (!open && currentId === id && onOpenChangeRef.current) {
      onOpenChangeRef.current(false);
      setState((state) => ({...state, delay: initialDelay, currentId: null}));
    }
  }, [open, setState, currentId, id, onOpenChangeRef, initialDelay]);
};
