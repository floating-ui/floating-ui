import {
  createContext,
  createEffect,
  createRenderEffect,
  JSX,
  JSXElement,
  mergeProps,
  onCleanup,
  Setter,
  useContext,
} from 'solid-js';
import {createStore} from 'solid-js/store';

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
  // setCurrentId: (id: any) => void;
  setState: Setter<Partial<GroupState>>;
}

const FloatingDelayGroupContext = createContext<GroupContext>({
  delay: 0,
  initialDelay: 0,
  timeoutMs: 0,
  currentId: null,
  // setCurrentId: () => undefined,
  isInstantPhase: false,
  setState: () => undefined,
});

export const useDelayGroupContext = () => useContext(FloatingDelayGroupContext);

interface FloatingDelayGroupProps {
  children?: JSXElement;
  delay: Delay;
  timeoutMs?: number;
}

/**
 * Provides context for a group of floating elements that should share a
 * `delay`.
 * @see https://floating-ui.com/docs/FloatingDelayGroup
 */
export const FloatingDelayGroup = (
  props: FloatingDelayGroupProps,
): JSX.Element => {
  const store = createStore({
    delay: props.delay,
    timeoutMs: props.timeoutMs ?? 0,
    initialDelay: props.delay,
    currentId: null,
    isInstantPhase: false,
  });
  const [state, setState] = store;
  let initialCurrentIdRef: any = null;

  createEffect(() => {
    const {currentId} = state;

    if (currentId) {
      if (initialCurrentIdRef === null) {
        initialCurrentIdRef = currentId;
      } else {
        setState({isInstantPhase: true});
      }
    } else {
      setState({isInstantPhase: false});
      initialCurrentIdRef = null;
    }
  });

  return (
    <FloatingDelayGroupContext.Provider value={mergeProps({setState}, state)}>
      {props.children}
    </FloatingDelayGroupContext.Provider>
  );
};

interface UseGroupOptions {
  id: any;
}

export const useDelayGroup = (
  floatingContext: FloatingContext,
  props: UseGroupOptions,
) => {
  const context = useDelayGroupContext();

  createEffect(() => {
    const {onOpenChange} = floatingContext;
    const {initialDelay, setState, currentId} = context;

    if (currentId) {
      setState({
        delay: {
          open: 1,
          close: getDelay(() => initialDelay, 'close'),
        },
      });

      if (currentId !== props.id) {
        onOpenChange(false);
      }
    }
  });

  createEffect(() => {
    const {currentId, initialDelay, setState, timeoutMs} = context;
    const {open, onOpenChange} = floatingContext;

    function unset() {
      onOpenChange(false);
      setState({delay: initialDelay, currentId: null});
    }
    if (!open() && currentId === props.id) {
      if (timeoutMs) {
        const timeout = window.setTimeout(unset, timeoutMs);
        onCleanup(() => {
          clearTimeout(timeout);
        });
      } else {
        unset();
      }
    }
  });

  createEffect(() => {
    const {open} = floatingContext;

    if (open()) {
      context.setState({currentId: props.id});
    } else {
      context.setState({currentId: null});
    }
  });
};
