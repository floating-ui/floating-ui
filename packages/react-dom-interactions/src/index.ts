import * as React from 'react';
import {
  useFloating as usePositionalFloating,
  ComputePositionReturn,
  VirtualElement,
} from '@floating-ui/react-dom';
import useLayoutEffect from 'use-isomorphic-layout-effect';
import type {
  FloatingContext,
  Middleware,
  Placement,
  Strategy,
  ContextData,
} from './types';
import {createPubSub} from './createPubSub';
import {useFloatingTree} from './FloatingTree';

type Data = Omit<ComputePositionReturn, 'x' | 'y'> & {
  x: number | null;
  y: number | null;
};

export type ReferenceType = Element | VirtualElement;

export type UseFloatingReturn<RT extends ReferenceType = ReferenceType> =
  Data & {
    update: () => void;
    reference: (node: RT | null) => void;
    floating: (node: HTMLElement | null) => void;
    refs: {
      reference: React.MutableRefObject<RT | null>;
      floating: React.MutableRefObject<HTMLElement | null>;
    };
  };

export interface Props<RT extends ReferenceType = ReferenceType> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placement: Placement;
  middleware: Array<Middleware>;
  strategy: Strategy;
  nodeId: string;
  whileElementsMounted?: (
    reference: RT,
    floating: HTMLElement,
    update: () => void
  ) => void | (() => void);
}

export function useFloating<RT extends ReferenceType = ReferenceType>({
  open = false,
  onOpenChange = () => {},
  whileElementsMounted,
  placement,
  middleware,
  strategy,
  nodeId,
}: Partial<Props> = {}): UseFloatingReturn<RT> & {
  context: FloatingContext<RT>;
} {
  const tree = useFloatingTree<RT>();
  const dataRef = React.useRef<ContextData>({});
  const events = React.useState(() => createPubSub())[0];
  const floating = usePositionalFloating<RT>({
    placement,
    middleware,
    strategy,
    whileElementsMounted,
  });

  const context = React.useMemo<FloatingContext<RT>>(
    () => ({
      ...floating,
      dataRef,
      nodeId,
      events,
      open,
      onOpenChange,
    }),
    [floating, dataRef, nodeId, events, open, onOpenChange]
  );

  useLayoutEffect(() => {
    const node = tree?.nodesRef.current.find((node) => node.id === nodeId);
    if (node) {
      node.context = context;
    }
  });

  return React.useMemo(
    () => ({
      context,
      ...floating,
    }),
    [floating, context]
  );
}

export * from '@floating-ui/react-dom';
export {useInteractions} from './useInteractions';
export {safePolygon} from './safePolygon';
export {FloatingPortal} from './FloatingPortal';
export {FloatingOverlay} from './FloatingOverlay';
export {FloatingFocusManager} from './FloatingFocusManager';
export {
  FloatingTree,
  FloatingNode,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useFloatingTree,
} from './FloatingTree';
export {
  FloatingDelayGroup,
  useDelayGroup,
  useDelayGroupContext,
} from './FloatingDelayGroup';
export {useRole} from './hooks/useRole';
export {useClick} from './hooks/useClick';
export {useDismiss} from './hooks/useDismiss';
export {useId} from './hooks/useId';
export {useFocus} from './hooks/useFocus';
export {useHover} from './hooks/useHover';
export {useListNavigation} from './hooks/useListNavigation';
export {useTypeahead} from './hooks/useTypeahead';
