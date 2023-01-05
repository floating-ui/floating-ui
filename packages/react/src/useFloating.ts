import {useFloating as usePosition} from '@floating-ui/react-dom';
import * as React from 'react';
import useLayoutEffect from 'use-isomorphic-layout-effect';

import {useFloatingTree} from './components/FloatingTree';
import {useEvent} from './hooks/utils/useEvent';
import type {
  ContextData,
  FloatingContext,
  ReferenceType,
  UseFloatingProps,
  UseFloatingReturn,
} from './types';
import {createPubSub} from './utils/createPubSub';
import {isElement} from './utils/is';

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
        (refs.domReference as React.MutableRefObject<Element | null>).current =
          node;
        setDomReference(node);
      }

      // Backwards-compatibility for passing a virtual element to `reference`
      // after it has set the DOM reference.
      if (
        isElement(refs.reference.current) ||
        refs.reference.current === null ||
        // Don't allow setting virtual elements using the old technique back to
        // `null` to support `positionReference` + an unstable `reference`
        // callback ref.
        (node !== null && !isElement(node))
      ) {
        reference(node);
      }
    },
    [reference, refs]
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
