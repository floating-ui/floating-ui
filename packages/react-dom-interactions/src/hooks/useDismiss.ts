import {getOverflowAncestors} from '@floating-ui/react-dom';
import * as React from 'react';
import {useFloatingParentNodeId, useFloatingTree} from '../FloatingTree';
import type {ElementProps, FloatingContext, ReferenceType} from '../types';
import {getChildren} from '../utils/getChildren';
import {getDocument} from '../utils/getDocument';
import {getTarget} from '../utils/getTarget';
import {isElement} from '../utils/is';
import {isEventTargetWithin} from '../utils/isEventTargetWithin';

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
  const nested = useFloatingParentNodeId() != null;
  const insideReactTreeRef = React.useRef(false);

  React.useEffect(() => {
    if (!open || !enabled) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (
          !bubbles &&
          tree &&
          getChildren(tree.nodesRef.current, nodeId).length > 0
        ) {
          return;
        }

        events.emit('dismiss', {preventScroll: false});
        onOpenChange(false);
      }
    }

    function onPointerDown(event: MouseEvent) {
      // Given developers can stop the propagation of the synthetic event,
      // we can only be confident with a positive value.
      const insideReactTree = insideReactTreeRef.current;
      insideReactTreeRef.current = false;

      if (insideReactTree) {
        return;
      }

      const target = getTarget(event);

      // Check if the click occurred on the scrollbar
      if (isElement(target) && refs.floating.current) {
        const win = refs.floating.current.ownerDocument.defaultView ?? window;
        const canScrollX = target.scrollWidth > target.clientWidth;
        const canScrollY = target.scrollHeight > target.clientHeight;

        let xCond = canScrollY && event.offsetX > target.clientWidth;

        // In some browsers it is possible to change the <body> (or window)
        // scrollbar to the left side, but is very rare and is difficult to
        // check for. Plus, for modal dialogs with backdrops, it is more
        // important that the backdrop is checked but not so much the window.
        if (canScrollY) {
          const isRTL = win.getComputedStyle(target).direction === 'rtl';

          if (isRTL) {
            xCond = event.offsetX <= target.offsetWidth - target.clientWidth;
          }
        }

        if (xCond || (canScrollX && event.offsetY > target.clientHeight)) {
          return;
        }
      }

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

      if (
        !bubbles &&
        tree &&
        getChildren(tree.nodesRef.current, nodeId).length > 0
      ) {
        return;
      }

      events.emit('dismiss', nested ? {preventScroll: true} : false);
      onOpenChange(false);
    }

    function onScroll() {
      onOpenChange(false);
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
    onOpenChange,
    ancestorScroll,
    enabled,
    bubbles,
    refs,
    nested,
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
    floating: {
      onPointerDownCapture() {
        insideReactTreeRef.current = true;
      },
    },
  };
};
