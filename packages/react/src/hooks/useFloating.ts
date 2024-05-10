import {useFloating as usePosition} from '@floating-ui/react-dom';
import {isElement} from '@floating-ui/utils/dom';
import * as React from 'react';
import useModernLayoutEffect from 'use-isomorphic-layout-effect';

import {useFloatingTree} from '../components/FloatingTree';
import type {
  FloatingContext,
  NarrowedElement,
  ReferenceType,
  UseFloatingOptions,
  UseFloatingReturn,
} from '../types';
import {useFloatingRoot} from './useFloatingRoot';

/**
 * Provides data to position a floating element and context to add interactions.
 * @see https://floating-ui.com/docs/useFloating
 */
export function useFloating<RT extends ReferenceType = ReferenceType>(
  options: UseFloatingOptions = {},
): UseFloatingReturn<RT> {
  const rootContext = useFloatingRoot(options);

  const [_domReference, setDomReference] =
    React.useState<NarrowedElement<RT> | null>(null);
  const [_positionReference, _setPositionReference] =
    React.useState<ReferenceType | null>(null);

  const optionDomReference = options.elements?.domReference;
  const optionPositionReference = options.elements?.reference;
  const domReference = (optionDomReference ||
    _domReference) as NarrowedElement<RT>;
  const positionReference = optionPositionReference || _positionReference;

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
  const tree = useFloatingTree();

  const domReferenceRef = React.useRef<NarrowedElement<RT> | null>(null);

  const setPositionReference = React.useCallback(
    (node: ReferenceType | null) => {
      const computedPositionReference = isElement(node)
        ? {
            getBoundingClientRect: () => node.getBoundingClientRect(),
            contextElement: node,
          }
        : node;
      // Store the positionReference in state if the DOM reference is specified externally via the
      // `elements.reference` option. This ensures that it won't be overridden on future renders.
      _setPositionReference(computedPositionReference);
      position.refs.setReference(computedPositionReference);
    },
    [position.refs],
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
      ...rootContext,
      refs,
      elements,
    }),
    [position, refs, elements, rootContext],
  );

  useModernLayoutEffect(() => {
    const node = tree?.nodesRef.current.find(
      (node) => node.id === rootContext.nodeId,
    );
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
