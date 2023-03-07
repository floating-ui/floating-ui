import {useFloating as usePosition} from '@floating-ui/react-dom';
import * as React from 'react';
import useLayoutEffect from 'use-isomorphic-layout-effect';

import {useFloatingTree} from './components/FloatingTree';
import {useId} from './hooks/useId';
import {useEvent} from './hooks/utils/useEvent';
import type {
  ContextData,
  FloatingContext,
  NarrowedElement,
  ReferenceType,
  UseFloatingProps,
  UseFloatingReturn,
} from './types';
import {createPubSub} from './utils/createPubSub';
import {isElement} from './utils/is';

/**
 * Provides data to position a floating element and context to add interactions.
 * @see https://floating-ui.com/docs/react
 */
export function useFloating<RT extends ReferenceType = ReferenceType>(
  options: Partial<UseFloatingProps> = {}
): UseFloatingReturn<RT> {
  const {open = false, onOpenChange: unstable_onOpenChange, nodeId} = options;

  const position = usePosition<RT>(options);
  const tree = useFloatingTree<RT>();
  const domReferenceRef = React.useRef<NarrowedElement<RT> | null>(null);
  const dataRef = React.useRef<ContextData>({});
  const events = React.useState(() => createPubSub())[0];

  const floatingId = useId();

  const [domReference, setDomReference] =
    React.useState<NarrowedElement<RT> | null>(null);

  const setPositionReference = React.useCallback(
    (node: ReferenceType | null) => {
      const positionReference = isElement(node)
        ? {
            getBoundingClientRect: () => node.getBoundingClientRect(),
            contextElement: node,
          }
        : node;
      position.refs.setReference(positionReference as RT | null);
    },
    [position.refs]
  );

  const setReference = React.useCallback(
    (node: RT | null) => {
      if (isElement(node) || node === null) {
        (domReferenceRef as React.MutableRefObject<Element | null>).current =
          node;
        setDomReference(node as NarrowedElement<RT> | null);
      }

      // Backwards-compatibility for passing a virtual element to `reference`
      // after it has set the DOM reference.
      if (
        isElement(position.refs.reference.current) ||
        position.refs.reference.current === null ||
        // Don't allow setting virtual elements using the old technique back to
        // `null` to support `positionReference` + an unstable `reference`
        // callback ref.
        (node !== null && !isElement(node))
      ) {
        position.refs.setReference(node);
      }
    },
    [position.refs]
  );

  const refs = React.useMemo(
    () => ({
      ...position.refs,
      setReference,
      setPositionReference,
      domReference: domReferenceRef,
    }),
    [position.refs, setReference, setPositionReference]
  );

  const elements = React.useMemo(
    () => ({
      ...position.elements,
      domReference: domReference,
    }),
    [position.elements, domReference]
  );

  const onOpenChange = useEvent(unstable_onOpenChange);

  const context = React.useMemo<FloatingContext<RT>>(
    () => ({
      ...position,
      refs,
      elements,
      dataRef,
      nodeId,
      floatingId,
      events,
      open,
      onOpenChange,
    }),
    [position, nodeId, floatingId, events, open, onOpenChange, refs, elements]
  );

  useLayoutEffect(() => {
    const node = tree?.nodesRef.current.find((node) => node.id === nodeId);
    if (node) {
      node.context = context;
    }
  });

  return React.useMemo(
    () => ({
      ...position,
      context,
      refs,
      elements,
      reference: setReference,
      positionReference: setPositionReference,
    }),
    [position, refs, elements, context, setReference, setPositionReference]
  ) as UseFloatingReturn<RT>;
}
