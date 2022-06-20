import * as React from 'react';
import {useFloating as usePositionalFloating} from '@floating-ui/react-dom';
import useLayoutEffect from 'use-isomorphic-layout-effect';
import type {
  FloatingContext,
  ContextData,
  ReferenceType,
  UseFloatingReturn,
  UseFloatingProps,
} from './types';
import {createPubSub} from './createPubSub';
import {useFloatingTree} from './FloatingTree';
import {isElement} from './utils/is';

export function useFloating<RT extends ReferenceType = ReferenceType>({
  open = false,
  onOpenChange = () => {},
  whileElementsMounted,
  placement,
  middleware,
  strategy,
  nodeId,
}: Partial<UseFloatingProps> = {}): UseFloatingReturn<RT> & {
  context: FloatingContext<RT>;
} {
  const tree = useFloatingTree<RT>();
  const dataRef = React.useRef<ContextData>({domReference: null});
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

  const {reference} = floating;
  const setReference: UseFloatingReturn<RT>['reference'] = React.useCallback(
    (node) => {
      if (isElement(node) || node === null) {
        dataRef.current.domReference = node;
      }

      reference(node);
    },
    [reference]
  );

  return React.useMemo(
    () => ({
      context,
      ...floating,
      reference: setReference,
    }),
    [floating, context, setReference]
  );
}
