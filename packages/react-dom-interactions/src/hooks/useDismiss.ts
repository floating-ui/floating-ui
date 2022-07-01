import {getOverflowAncestors} from '@floating-ui/react-dom';
import * as React from 'react';
import {useFloatingTree} from '../FloatingTree';
import type {ElementProps, FloatingContext, ReferenceType} from '../types';
import {activeElement} from '../utils/activeElement';
import {getChildren} from '../utils/getChildren';
import {getDocument} from '../utils/getDocument';
import {isElement} from '../utils/is';
import {isEventTargetWithin} from '../utils/isEventTargetWithin';
import {useLatestRef} from '../utils/useLatestRef';

export interface Props {
  enabled?: boolean;
  escapeKey?: boolean;
  referencePointerDown?: boolean;
  outsidePointerDown?: boolean;
  ancestorScroll?: boolean;
  bubbles?: boolean;
}

/**
 * Adds listeners that dismiss (close) the floating element.
 * @see https://floating-ui.com/docs/useDismiss
 */
export const useDismiss = <RT extends ReferenceType = ReferenceType>(
  {open, onOpenChange, refs, events, nodeId}: FloatingContext<RT>,
  {
    enabled = true,
    escapeKey = true,
    outsidePointerDown = true,
    referencePointerDown = false,
    ancestorScroll = false,
    bubbles = true,
  }: Props = {}
): ElementProps => {
  const tree = useFloatingTree();
  const onOpenChangeRef = useLatestRef(onOpenChange);

  const isFocusInsideFloating = React.useCallback(() => {
    return refs.floating.current?.contains(
      activeElement(getDocument(refs.floating.current))
    );
  }, [refs]);

  React.useEffect(() => {
    if (!open || !enabled) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (!bubbles && !isFocusInsideFloating()) {
          return;
        }

        events.emit('dismiss', true);
        onOpenChangeRef.current(false);
      }
    }

    function onPointerDown(event: MouseEvent) {
      const targetIsInsideChildren =
        tree &&
        getChildren(tree.nodesRef.current, nodeId).some((node) =>
          isEventTargetWithin(event, node.context?.refs.floating.current)
        );

      if (
        isEventTargetWithin(event, refs.floating.current) ||
        isEventTargetWithin(event, refs.domReference.current) ||
        targetIsInsideChildren
      ) {
        return;
      }

      if (!bubbles && !isFocusInsideFloating()) {
        return;
      }

      events.emit('dismiss');
      onOpenChangeRef.current(false);
    }

    function onScroll() {
      onOpenChangeRef.current(false);
    }

    const doc = getDocument(refs.floating.current);
    escapeKey && doc.addEventListener('keydown', onKeyDown);
    outsidePointerDown && doc.addEventListener('pointerdown', onPointerDown);

    const ancestors = (
      ancestorScroll
        ? [
            ...(isElement(refs.reference.current)
              ? getOverflowAncestors(refs.reference.current)
              : []),
            ...(isElement(refs.floating.current)
              ? getOverflowAncestors(refs.floating.current)
              : []),
          ]
        : []
    ).filter(
      (ancestor) =>
        // Ignore the visual viewport for scrolling dismissal (allow pinch-zoom)
        ancestor !== doc.defaultView?.visualViewport
    );
    ancestors.forEach((ancestor) =>
      ancestor.addEventListener('scroll', onScroll, {passive: true})
    );

    return () => {
      escapeKey && doc.removeEventListener('keydown', onKeyDown);
      outsidePointerDown &&
        doc.removeEventListener('pointerdown', onPointerDown);
      ancestors.forEach((ancestor) =>
        ancestor.removeEventListener('scroll', onScroll)
      );
    };
  }, [
    escapeKey,
    outsidePointerDown,
    events,
    tree,
    nodeId,
    open,
    onOpenChangeRef,
    ancestorScroll,
    enabled,
    bubbles,
    isFocusInsideFloating,
    refs,
  ]);

  if (!enabled) {
    return {};
  }

  return {
    reference: {
      onPointerDown() {
        if (referencePointerDown) {
          events.emit('dismiss');
          onOpenChange(false);
        }
      },
    },
  };
};
