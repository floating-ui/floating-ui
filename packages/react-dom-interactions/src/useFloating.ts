import * as React from 'react';
import {useFloating as usePosition} from '@floating-ui/react-dom';
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
import {useEvent} from './utils/useEvent';

export function useFloating<RT extends ReferenceType = ReferenceType>({
  open = false,
  onOpenChange: unstable_onOpenChange,
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
  const position = usePosition<RT>({
    placement,
    middleware,
    strategy,
    whileElementsMounted,
  });

  const onOpenChange = useEvent(unstable_onOpenChange);

  const refs = React.useMemo(
    () => ({
      ...position.refs,
      domReference: domReferenceRef,
    }),
    [position.refs]
  );

  const context = React.useMemo<FloatingContext<RT>>(
    () => ({
      ...position,
      refs,
      dataRef,
      nodeId,
      events,
      open,
      onOpenChange,
    }),
    [position, nodeId, events, open, onOpenChange, refs]
  );

  useLayoutEffect(() => {
    const node = tree?.nodesRef.current.find((node) => node.id === nodeId);
    if (node) {
      node.context = context;
    }
  });

  const {reference} = position;
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
      ...position,
      context,
      refs,
      reference: setReference,
    }),
    [position, refs, context, setReference]
  );
}
