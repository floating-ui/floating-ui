import {getOverflowAncestors} from '@floating-ui/react-dom';
import * as React from 'react';

import {
  useFloatingParentNodeId,
  useFloatingTree,
} from '../components/FloatingTree';
import type {ElementProps, FloatingContext, ReferenceType} from '../types';
import {getChildren} from '../utils/getChildren';
import {getDocument} from '../utils/getDocument';
import {getTarget} from '../utils/getTarget';
import {isElement, isVirtualClick, isVirtualPointerEvent} from '../utils/is';
import {isEventTargetWithin} from '../utils/isEventTargetWithin';
import {useEvent} from './utils/useEvent';

const bubbleHandlerKeys = {
  pointerdown: 'onPointerDown',
  mousedown: 'onMouseDown',
  click: 'onClick',
};

const captureHandlerKeys = {
  pointerdown: 'onPointerDownCapture',
  mousedown: 'onMouseDownCapture',
  click: 'onClickCapture',
};

export const normalizeBubblesProp = (
  bubbles: boolean | {escapeKey?: boolean; outsidePress?: boolean} = true
) => {
  return {
    escapeKeyBubbles:
      typeof bubbles === 'boolean' ? bubbles : bubbles.escapeKey ?? true,
    outsidePressBubbles:
      typeof bubbles === 'boolean' ? bubbles : bubbles.outsidePress ?? true,
  };
};

export interface DismissPayload {
  type: 'outsidePress' | 'referencePress' | 'escapeKey' | 'mouseLeave';
  data: {
    returnFocus: boolean | {preventScroll: boolean};
  };
}

export interface Props {
  enabled?: boolean;
  escapeKey?: boolean;
  referencePress?: boolean;
  referencePressEvent?: 'pointerdown' | 'mousedown' | 'click';
  outsidePress?: boolean | ((event: MouseEvent) => boolean);
  outsidePressEvent?: 'pointerdown' | 'mousedown' | 'click';
  ancestorScroll?: boolean;
  bubbles?: boolean | {escapeKey?: boolean; outsidePress?: boolean};
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
    outsidePress: unstable_outsidePress = true,
    outsidePressEvent = 'pointerdown',
    referencePress = false,
    referencePressEvent = 'pointerdown',
    ancestorScroll = false,
    bubbles = true,
  }: Props = {}
): ElementProps => {
  const tree = useFloatingTree();
  const nested = useFloatingParentNodeId() != null;
  const outsidePressFn = useEvent(
    typeof unstable_outsidePress === 'function'
      ? unstable_outsidePress
      : () => false
  );
  const outsidePress =
    typeof unstable_outsidePress === 'function'
      ? outsidePressFn
      : unstable_outsidePress;
  const insideReactTreeRef = React.useRef(false);
  const {escapeKeyBubbles, outsidePressBubbles} = normalizeBubblesProp(bubbles);

  React.useEffect(() => {
    if (!open || !enabled) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (
          !escapeKeyBubbles &&
          tree &&
          getChildren(tree.nodesRef.current, nodeId).length > 0
        ) {
          return;
        }

        events.emit('dismiss', {
          type: 'escapeKey',
          data: {
            returnFocus: {preventScroll: false},
          },
        });

        onOpenChange(false);
      }
    }

    function onOutsidePress(event: MouseEvent) {
      // Given developers can stop the propagation of the synthetic event,
      // we can only be confident with a positive value.
      const insideReactTree = insideReactTreeRef.current;
      insideReactTreeRef.current = false;

      if (insideReactTree) {
        return;
      }

      if (typeof outsidePress === 'function' && !outsidePress(event)) {
        return;
      }

      const target = getTarget(event);

      // Check if the click occurred on the scrollbar
      if (isElement(target) && refs.floating.current) {
        const win = refs.floating.current.ownerDocument.defaultView || window;
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
        !outsidePressBubbles &&
        tree &&
        getChildren(tree.nodesRef.current, nodeId).length > 0
      ) {
        return;
      }

      events.emit('dismiss', {
        type: 'outsidePress',
        data: {
          returnFocus: nested
            ? {preventScroll: true}
            : isVirtualClick(event) ||
              isVirtualPointerEvent(event as PointerEvent),
        },
      });

      onOpenChange(false);
    }

    function onScroll() {
      onOpenChange(false);
    }

    const doc = getDocument(refs.floating.current);
    escapeKey && doc.addEventListener('keydown', onKeyDown);
    outsidePress && doc.addEventListener(outsidePressEvent, onOutsidePress);

    let ancestors: (Element | Window | VisualViewport)[] = [];

    if (ancestorScroll) {
      if (isElement(refs.domReference.current)) {
        ancestors = getOverflowAncestors(refs.domReference.current);
      }

      if (isElement(refs.floating.current)) {
        ancestors = ancestors.concat(
          getOverflowAncestors(refs.floating.current)
        );
      }

      if (
        !isElement(refs.reference.current) &&
        refs.reference.current &&
        // @ts-expect-error is VirtualElement
        refs.reference.current.contextElement
      ) {
        ancestors = ancestors.concat(
          // @ts-expect-error is VirtualElement
          getOverflowAncestors(refs.reference.current.contextElement)
        );
      }
    }

    // Ignore the visual viewport for scrolling dismissal (allow pinch-zoom)
    ancestors = ancestors.filter(
      (ancestor) => ancestor !== doc.defaultView?.visualViewport
    );

    ancestors.forEach((ancestor) => {
      ancestor.addEventListener('scroll', onScroll, {passive: true});
    });

    return () => {
      escapeKey && doc.removeEventListener('keydown', onKeyDown);
      outsidePress &&
        doc.removeEventListener(outsidePressEvent, onOutsidePress);
      ancestors.forEach((ancestor) => {
        ancestor.removeEventListener('scroll', onScroll);
      });
    };
  }, [
    escapeKey,
    outsidePress,
    outsidePressEvent,
    events,
    tree,
    nodeId,
    open,
    onOpenChange,
    ancestorScroll,
    enabled,
    escapeKeyBubbles,
    outsidePressBubbles,
    refs,
    nested,
  ]);

  React.useEffect(() => {
    insideReactTreeRef.current = false;
  }, [outsidePress, outsidePressEvent]);

  return React.useMemo(() => {
    if (!enabled) {
      return {};
    }

    return {
      reference: {
        [bubbleHandlerKeys[referencePressEvent]]: () => {
          if (referencePress) {
            events.emit('dismiss', {
              type: 'referencePress',
              data: {returnFocus: false},
            });
            onOpenChange(false);
          }
        },
      },
      floating: {
        [captureHandlerKeys[outsidePressEvent]]: () => {
          insideReactTreeRef.current = true;
        },
      },
    };
  }, [
    enabled,
    events,
    referencePress,
    outsidePressEvent,
    referencePressEvent,
    onOpenChange,
  ]);
};
