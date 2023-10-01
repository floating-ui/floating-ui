import {
  contains,
  getDocument,
  getTarget,
  isEventTargetWithin,
  isReactEvent,
  isRootElement,
  isVirtualClick,
  isVirtualPointerEvent,
} from '@floating-ui/react/utils';
import {getOverflowAncestors} from '@floating-ui/react-dom';
import {
  getComputedStyle,
  getParentNode,
  isElement,
  isHTMLElement,
  isLastTraversableNode,
} from '@floating-ui/utils/dom';
import * as React from 'react';

import {
  useFloatingParentNodeId,
  useFloatingTree,
} from '../components/FloatingTree';
import type {ElementProps, FloatingContext, ReferenceType} from '../types';
import {createAttribute} from '../utils/createAttribute';
import {getChildren} from '../utils/getChildren';
import {useEffectEvent} from './utils/useEffectEvent';

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
  bubbles?: boolean | {escapeKey?: boolean; outsidePress?: boolean}
) => {
  return {
    escapeKeyBubbles:
      typeof bubbles === 'boolean' ? bubbles : bubbles?.escapeKey ?? false,
    outsidePressBubbles:
      typeof bubbles === 'boolean' ? bubbles : bubbles?.outsidePress ?? true,
  };
};

export interface DismissPayload {
  type: 'outsidePress' | 'referencePress' | 'escapeKey' | 'mouseLeave';
  data: {
    returnFocus: boolean | {preventScroll: boolean};
  };
}

export interface UseDismissProps {
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
 * Closes the floating element when a dismissal is requested — by default, when
 * the user presses the `escape` key or outside of the floating element.
 * @see https://floating-ui.com/docs/useDismiss
 */
export function useDismiss<RT extends ReferenceType = ReferenceType>(
  context: FloatingContext<RT>,
  props: UseDismissProps = {}
): ElementProps {
  const {
    open,
    onOpenChange,
    events,
    nodeId,
    elements: {reference, domReference, floating},
    dataRef,
  } = context;
  const {
    enabled = true,
    escapeKey = true,
    outsidePress: unstable_outsidePress = true,
    outsidePressEvent = 'pointerdown',
    referencePress = false,
    referencePressEvent = 'pointerdown',
    ancestorScroll = false,
    bubbles,
  } = props;

  const tree = useFloatingTree();
  const nested = useFloatingParentNodeId() != null;
  const outsidePressFn = useEffectEvent(
    typeof unstable_outsidePress === 'function'
      ? unstable_outsidePress
      : () => false
  );
  const outsidePress =
    typeof unstable_outsidePress === 'function'
      ? outsidePressFn
      : unstable_outsidePress;
  const insideReactTreeRef = React.useRef(false);
  const endedOrStartedInsideRef = React.useRef(false);
  const {escapeKeyBubbles, outsidePressBubbles} = normalizeBubblesProp(bubbles);

  const closeOnEscapeKeyDown = useEffectEvent(
    (event: React.KeyboardEvent<Element> | KeyboardEvent) => {
      if (!open || !enabled || !escapeKey || event.key !== 'Escape') {
        return;
      }

      const children = tree ? getChildren(tree.nodesRef.current, nodeId) : [];

      if (!escapeKeyBubbles) {
        event.stopPropagation();

        if (children.length > 0) {
          let shouldDismiss = true;

          children.forEach((child) => {
            if (
              child.context?.open &&
              !child.context.dataRef.current.__escapeKeyBubbles
            ) {
              shouldDismiss = false;
              return;
            }
          });

          if (!shouldDismiss) {
            return;
          }
        }
      }

      events.emit('dismiss', {
        type: 'escapeKey',
        data: {
          returnFocus: {preventScroll: false},
        },
      });

      onOpenChange(false, isReactEvent(event) ? event.nativeEvent : event);
    }
  );

  const closeOnPressOutside = useEffectEvent((event: MouseEvent) => {
    // Given developers can stop the propagation of the synthetic event,
    // we can only be confident with a positive value.
    const insideReactTree = insideReactTreeRef.current;
    insideReactTreeRef.current = false;

    // When click outside is lazy (`click` event), handle dragging.
    // Don't close if:
    // - The click started inside the floating element.
    // - The click ended inside the floating element.
    const endedOrStartedInside = endedOrStartedInsideRef.current;
    endedOrStartedInsideRef.current = false;

    if (outsidePressEvent === 'click' && endedOrStartedInside) {
      return;
    }

    if (insideReactTree) {
      return;
    }

    if (typeof outsidePress === 'function' && !outsidePress(event)) {
      return;
    }

    const target = getTarget(event);
    const inertSelector = `[${createAttribute('inert')}]`;
    const markers = getDocument(floating).querySelectorAll(inertSelector);

    let targetRootAncestor = isElement(target) ? target : null;
    while (targetRootAncestor && !isLastTraversableNode(targetRootAncestor)) {
      const nextParent = getParentNode(targetRootAncestor);
      if (nextParent === getDocument(floating).body || !isElement(nextParent)) {
        break;
      } else {
        targetRootAncestor = nextParent;
      }
    }

    // Check if the click occurred on a third-party element injected after the
    // floating element rendered.
    if (
      markers.length &&
      isElement(target) &&
      !isRootElement(target) &&
      // Clicked on a direct ancestor (e.g. FloatingOverlay).
      !contains(target, floating) &&
      // If the target root element contains none of the markers, then the
      // element was injected after the floating element rendered.
      Array.from(markers).every(
        (marker) => !contains(targetRootAncestor, marker)
      )
    ) {
      return;
    }

    // Check if the click occurred on the scrollbar
    if (isHTMLElement(target) && floating) {
      // In Firefox, `target.scrollWidth > target.clientWidth` for inline
      // elements.
      const canScrollX =
        target.clientWidth > 0 && target.scrollWidth > target.clientWidth;
      const canScrollY =
        target.clientHeight > 0 && target.scrollHeight > target.clientHeight;

      let xCond = canScrollY && event.offsetX > target.clientWidth;

      // In some browsers it is possible to change the <body> (or window)
      // scrollbar to the left side, but is very rare and is difficult to
      // check for. Plus, for modal dialogs with backdrops, it is more
      // important that the backdrop is checked but not so much the window.
      if (canScrollY) {
        const isRTL = getComputedStyle(target).direction === 'rtl';

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
        isEventTargetWithin(event, node.context?.elements.floating)
      );

    if (
      isEventTargetWithin(event, floating) ||
      isEventTargetWithin(event, domReference) ||
      targetIsInsideChildren
    ) {
      return;
    }

    const children = tree ? getChildren(tree.nodesRef.current, nodeId) : [];
    if (children.length > 0) {
      let shouldDismiss = true;

      children.forEach((child) => {
        if (
          child.context?.open &&
          !child.context.dataRef.current.__outsidePressBubbles
        ) {
          shouldDismiss = false;
          return;
        }
      });

      if (!shouldDismiss) {
        return;
      }
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

    onOpenChange(false, event);
  });

  React.useEffect(() => {
    if (!open || !enabled) {
      return;
    }

    dataRef.current.__escapeKeyBubbles = escapeKeyBubbles;
    dataRef.current.__outsidePressBubbles = outsidePressBubbles;

    function onScroll(event: Event) {
      onOpenChange(false, event);
    }

    const doc = getDocument(floating);
    escapeKey && doc.addEventListener('keydown', closeOnEscapeKeyDown);
    outsidePress &&
      doc.addEventListener(outsidePressEvent, closeOnPressOutside);

    let ancestors: (Element | Window | VisualViewport)[] = [];

    if (ancestorScroll) {
      if (isElement(domReference)) {
        ancestors = getOverflowAncestors(domReference);
      }

      if (isElement(floating)) {
        ancestors = ancestors.concat(getOverflowAncestors(floating));
      }

      if (!isElement(reference) && reference && reference.contextElement) {
        ancestors = ancestors.concat(
          getOverflowAncestors(reference.contextElement)
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
      escapeKey && doc.removeEventListener('keydown', closeOnEscapeKeyDown);
      outsidePress &&
        doc.removeEventListener(outsidePressEvent, closeOnPressOutside);
      ancestors.forEach((ancestor) => {
        ancestor.removeEventListener('scroll', onScroll);
      });
    };
  }, [
    dataRef,
    floating,
    domReference,
    reference,
    escapeKey,
    outsidePress,
    outsidePressEvent,
    open,
    onOpenChange,
    ancestorScroll,
    enabled,
    escapeKeyBubbles,
    outsidePressBubbles,
    closeOnEscapeKeyDown,
    closeOnPressOutside,
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
        onKeyDown: closeOnEscapeKeyDown,
        [bubbleHandlerKeys[referencePressEvent]]: (
          event: React.SyntheticEvent
        ) => {
          if (referencePress) {
            events.emit('dismiss', {
              type: 'referencePress',
              data: {returnFocus: false},
            });
            onOpenChange(false, event.nativeEvent);
          }
        },
      },
      floating: {
        onKeyDown: closeOnEscapeKeyDown,
        onMouseDown() {
          endedOrStartedInsideRef.current = true;
        },
        onMouseUp() {
          endedOrStartedInsideRef.current = true;
        },
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
    closeOnEscapeKeyDown,
  ]);
}
