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
}: Partial<UseFloatingProps> = {}): UseFloatingReturn<RT> {
  const tree = useFloatingTree<RT>();
  const domReferenceRef = React.useRef<Element | null>(null);
  const dataRef = React.useRef<ContextData>({});
  const events = React.useState(() => createPubSub())[0];
  const floating = usePositionalFloating<RT>({
    placement,
    middleware,
    strategy,
    whileElementsMounted,
  });

  const refs = React.useMemo(
    () => ({
      ...floating.refs,
      domReference: domReferenceRef,
    }),
    [floating.refs]
  );

  const context = React.useMemo<FloatingContext<RT>>(
    () => ({
      ...floating,
      refs,
      dataRef,
      nodeId,
      events,
      open,
      onOpenChange,
    }),
    [floating, nodeId, events, open, onOpenChange, refs]
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
        context.refs.domReference.current = node;
      }

      reference(node);
    },
    [reference, context.refs]
  );

  return React.useMemo(
    () => ({
      ...floating,
      context,
      refs,
      reference: setReference,
    }),
    [floating, refs, context, setReference]
  );
}
