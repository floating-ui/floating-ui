import {
  useFloating as usePosition,
  VirtualElement,
} from '@floating-ui/react-dom';
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

function isExternalElement(value: any): value is Element | VirtualElement {
  if (value === null) {
    return true;
  }
  return value ? !!value.getBoundingClientRect : false;
}

export function useFloating<RT extends ReferenceType = ReferenceType>(
  externalReferenceOrOptions?: RT | null | Partial<UseFloatingProps>,
  externalFloating?: HTMLElement | null,
  options: Partial<UseFloatingProps> = {}
): UseFloatingReturn<RT> {
  const isExternalSync = isExternalElement(externalReferenceOrOptions);

  if (externalReferenceOrOptions && !isExternalSync) {
    options = externalReferenceOrOptions;
  }

  const {
    open = false,
    onOpenChange: unstable_onOpenChange,
    whileElementsMounted,
    placement,
    middleware,
    strategy,
    nodeId,
  } = options;

  const tree = useFloatingTree<RT>();
  const domReferenceRef = React.useRef<
    (RT extends Element ? RT : Element) | null
  >(null);
  const dataRef = React.useRef<ContextData>({});
  const events = React.useState(() => createPubSub())[0];

  const position = usePosition<RT>(
    isExternalSync
      ? externalReferenceOrOptions
      : {open, placement, middleware, strategy, whileElementsMounted},
    isExternalSync ? externalFloating : undefined,
    isExternalSync ? options : undefined
  );

  const [domReference, setDomReference] = React.useState<Element | null>(null);

  useLayoutEffect(() => {
    if (isExternalSync && isElement(externalReferenceOrOptions)) {
      setDomReference(externalReferenceOrOptions);
    }
  }, [isExternalSync, externalReferenceOrOptions]);

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

  const refs = React.useMemo(
    () => ({
      ...position.refs,
      domReference: domReferenceRef,
      setPositionReference,
    }),
    [position.refs, setPositionReference]
  );

  const elements = React.useMemo(
    () => ({
      ...position.elements,
      domReference: domReference,
    }),
    [position.elements, domReference]
  );

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
        refs.setReference(node);
      }
    },
    [refs]
  );

  const onOpenChange = useEvent(unstable_onOpenChange);

  const context = React.useMemo<FloatingContext<RT>>(
    () => ({
      ...position,
      refs,
      elements,
      dataRef,
      nodeId,
      events,
      open,
      onOpenChange,
    }),
    [position, nodeId, events, open, onOpenChange, refs, elements]
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
      reference: setReference,
      positionReference: setPositionReference,
    }),
    [position, refs, context, setReference, setPositionReference]
  ) as UseFloatingReturn<RT>;
}
