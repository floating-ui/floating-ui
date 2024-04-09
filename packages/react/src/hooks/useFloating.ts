import {useFloating as usePosition} from '@floating-ui/react-dom';
import {isElement} from '@floating-ui/utils/dom';
import * as React from 'react';
import useModernLayoutEffect from 'use-isomorphic-layout-effect';

import {
  useFloatingParentNodeId,
  useFloatingTree,
} from '../components/FloatingTree';
import type {
  ContextData,
  FloatingContext,
  NarrowedElement,
  OpenChangeReason,
  ReferenceType,
  UseFloatingOptions,
  UseFloatingReturn,
} from '../types';
import {createPubSub} from '../utils/createPubSub';
import {useId} from './useId';
import {useEffectEvent} from './utils/useEffectEvent';
import {error} from '../utils/log';

let devMessageSet: Set<string> | undefined;
if (__DEV__) {
  devMessageSet = new Set();
}

/**
 * Provides data to position a floating element and context to add interactions.
 * @see https://floating-ui.com/docs/useFloating
 */
export function useFloating<RT extends ReferenceType = ReferenceType>(
  options: Partial<UseFloatingOptions> = {},
): UseFloatingReturn<RT> {
  const {open = false, onOpenChange: unstable_onOpenChange, nodeId} = options;

  const [_domReference, setDomReference] =
    React.useState<NarrowedElement<RT> | null>(null);
  const [positionReference, _setPositionReference] =
    React.useState<ReferenceType | null>(null);

  const optionDomReference = options.elements?.reference;
  const domReference = (optionDomReference ||
    _domReference) as NarrowedElement<RT>;

  if (__DEV__) {
    if (optionDomReference && !isElement(optionDomReference)) {
      error(
        'Cannot pass a virtual element to the `elements.reference` option,',
        'as it must be a real DOM element. Use `refs.setPositionReference()`',
        'instead.',
      );
    }
  }

  useModernLayoutEffect(() => {
    if (domReference) {
      domReferenceRef.current = domReference;
    }
  }, [domReference]);

  const position = usePosition({
    ...options,
    elements: {
      ...options.elements,
      ...(positionReference && {reference: positionReference}),
    },
  });
  const tree = useFloatingTree<RT>();
  const nested = useFloatingParentNodeId() != null;

  const onOpenChange = useEffectEvent(
    (open: boolean, event?: Event, reason?: OpenChangeReason) => {
      if (open) {
        dataRef.current.openEvent = event;
      }
      events.emit('openchange', {open, event, reason, nested});
      unstable_onOpenChange?.(open, event, reason);
    },
  );

  const domReferenceRef = React.useRef<NarrowedElement<RT> | null>(null);
  const dataRef = React.useRef<ContextData>({});
  const events = React.useState(() => createPubSub())[0];

  const floatingId = useId();

  const setPositionReference = React.useCallback(
    (node: ReferenceType | null) => {
      const positionReference = isElement(node)
        ? {
            getBoundingClientRect: () => node.getBoundingClientRect(),
            contextElement: node,
          }
        : node;
      // Store the positionReference in state if the DOM reference is specified externally via the
      // `elements.reference` option. This ensures that it won't be overridden on future renders.
      if (optionDomReference) {
        _setPositionReference(positionReference);
      } else if (positionReference !== null) {
        _setPositionReference(null);
      }
      position.refs.setReference(positionReference as RT | null);
    },
    [position.refs, optionDomReference],
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
    [position.refs],
  );

  const refs = React.useMemo(
    () => ({
      ...position.refs,
      setReference,
      setPositionReference,
      domReference: domReferenceRef,
    }),
    [position.refs, setReference, setPositionReference],
  );

  const elements = React.useMemo(
    () => ({
      ...position.elements,
      domReference: domReference,
    }),
    [position.elements, domReference],
  );

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
    [position, nodeId, floatingId, events, open, onOpenChange, refs, elements],
  );

  useModernLayoutEffect(() => {
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
    }),
    [position, refs, elements, context],
  ) as UseFloatingReturn<RT>;
}
