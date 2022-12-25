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
import {createPubSub} from './utils/createPubSub';
import {useFloatingTree} from './components/FloatingTree';
import {isElement} from './utils/is';
import {useEvent} from './hooks/utils/useEvent';

export function useFloating<RT extends ReferenceType = ReferenceType>({
  open = false,
  onOpenChange: unstable_onOpenChange,
  whileElementsMounted,
  placement,
  middleware,
  strategy,
  nodeId,
}: Partial<UseFloatingProps> = {}): UseFloatingReturn<RT> {
  const [domReference, setDomReference] = React.useState<Element | null>(null);
  const tree = useFloatingTree<RT>();
  const domReferenceRef = React.useRef<
    (RT extends Element ? RT : Element) | null
  >(null);
  const dataRef = React.useRef<ContextData>({});
  const events = React.useState(() => createPubSub())[0];
  const position = usePosition<RT>({
    open,
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
      _: {domReference},
    }),
    [position, nodeId, events, open, onOpenChange, refs, domReference]
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
        (
          context.refs.domReference as React.MutableRefObject<Element | null>
        ).current = node;
        setDomReference(node);
      }

      if (
        context.refs.reference.current === null ||
        isElement(context.refs.reference.current)
      ) {
        reference(node);
      }
    },
    [reference, context.refs]
  );

  const setPositionReference = React.useCallback(
    (node: ReferenceType | null) => {
      const positionReference = isElement(node)
        ? {
            getBoundingClientRect: () => node.getBoundingClientRect(),
            contextElement: node,
          }
        : node;
      reference(positionReference as RT | null);
    },
    [reference]
  );

  return React.useMemo(
    () => ({
      ...position,
      context,
      refs,
      reference: setReference,
      positionReference: setPositionReference,
    }),
    [position, refs, context, setReference, setPositionReference]
  ) as UseFloatingReturn<RT>;
}
