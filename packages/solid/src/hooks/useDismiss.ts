import {getOverflowAncestors} from '@floating-ui/dom';
import {
  getComputedStyle,
  getParentNode,
  isElement,
  isHTMLElement,
  isLastTraversableNode,
} from '@floating-ui/utils/dom';
import {
  contains,
  getDocument,
  getTarget,
  isEventTargetWithin,
  // isReactEvent,
  isRootElement,
  isVirtualClick,
  isVirtualPointerEvent,
} from '@floating-ui/utils/react';
import {destructure} from '@solid-primitives/destructure';
import {createEffect, onCleanup} from 'solid-js';

import {
  useFloatingParentNodeId,
  useFloatingTree,
} from '../components/FloatingTree';
import type {ElementProps, FloatingContext, ReferenceType} from '../types';
import {createAttribute} from '../utils/createAttribute';
import {getChildren} from '../utils/getChildren';

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

type DefaultUseDismissProps = {
  enabled: boolean;
  escapeKey: boolean;
  referencePress: boolean;
  referencePressEvent: 'pointerdown' | 'mousedown' | 'click';
  outsidePress: boolean | ((event: MouseEvent) => boolean);
  outsidePressEvent: 'pointerdown' | 'mousedown' | 'click';
};
const defaultUseDismissProps: DefaultUseDismissProps = {
  enabled: true,
  escapeKey: true,
  outsidePress: true,
  outsidePressEvent: 'pointerdown',
  referencePress: false,
  referencePressEvent: 'pointerdown',
};
export interface UseDismissProps extends Partial<DefaultUseDismissProps> {
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
  props: UseDismissProps
): ElementProps {
  const {
    open,
    onOpenChange,
    events,
    nodeId,
    // elements, //: {reference, domReference, floating},
    dataRef,
  } = destructure(context);
  const {
    enabled,
    escapeKey,
    outsidePress: unstable_outsidePress,
    outsidePressEvent,
    referencePress,
    referencePressEvent,
    ancestorScroll,
    bubbles,
  } = destructure({
    ...props,
    ...defaultUseDismissProps,
  });

  const tree = useFloatingTree();

  const nested = useFloatingParentNodeId() != null;
  const outsidePressFn =
    typeof unstable_outsidePress === 'function'
      ? unstable_outsidePress
      : () => false;

  const outsidePress =
    typeof unstable_outsidePress === 'function'
      ? outsidePressFn()
      : unstable_outsidePress;
  let insideReactTreeRef = false; //React.useRef(false);

  const {escapeKeyBubbles, outsidePressBubbles} = destructure(
    normalizeBubblesProp(bubbles && bubbles())
  );

  const closeOnEscapeKeyDown = (event: KeyboardEvent) => {
    if (!open() || !enabled() || !escapeKey() || event.key !== 'Escape') {
      return;
    }

    const children = tree() ? getChildren(tree().nodesRef, nodeId()) : [];

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

    events().emit('dismiss', {
      type: 'escapeKey',
      data: {
        returnFocus: {preventScroll: false},
      },
    });

    onOpenChange()(false, event);
  };

  const closeOnPressOutside = (event: MouseEvent) => {
    // Given developers can stop the propagation of the synthetic event,
    // we can only be confident with a positive value.
    const insideReactTree = insideReactTreeRef;
    insideReactTreeRef = false;

    if (insideReactTree) {
      return;
    }

    if (typeof outsidePress === 'function' && !outsidePress(event)) {
      return;
    }

    const target = getTarget(event);
    const floating = context.refs.floating();
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
      tree() &&
      getChildren(tree().nodesRef, nodeId()).some((node) =>
        isEventTargetWithin(event, node.context?.refs.floating())
      );
    const domRef = context.refs.reference() as HTMLElement | null;
    if (
      isEventTargetWithin(event, floating) ||
      isEventTargetWithin(event, domRef) ||
      targetIsInsideChildren
    ) {
      return;
    }

    const children = tree() ? getChildren(tree().nodesRef, nodeId()) : [];
    if (children.length > 0) {
      let shouldDismiss = true;

      children.forEach((child) => {
        if (
          child.context?.open() &&
          !child.context.dataRef.__outsidePressBubbles
        ) {
          shouldDismiss = false;
          return;
        }
      });

      if (!shouldDismiss) {
        return;
      }
    }

    events().emit('dismiss', {
      type: 'outsidePress',
      data: {
        returnFocus: nested
          ? {preventScroll: true}
          : isVirtualClick(event) ||
            isVirtualPointerEvent(event as PointerEvent),
      },
    });

    onOpenChange()(false, event);
  };

  //onMount ??
  createEffect(() => {
    if (!open() || !enabled()) {
      return;
    }
    const {floating, reference} = context.refs;
    const domReference = reference() as Node | null;

    dataRef().__escapeKeyBubbles = escapeKeyBubbles();
    dataRef().__outsidePressBubbles = outsidePressBubbles();

    function onScroll(event: Event) {
      onOpenChange()(false, event);
    }

    const doc = getDocument(floating());
    escapeKey() && doc.addEventListener('keydown', closeOnEscapeKeyDown);
    outsidePress &&
      doc.addEventListener(outsidePressEvent(), closeOnPressOutside);

    let ancestors: (Element | Window | VisualViewport)[] = [];

    if (ancestorScroll) {
      if (isElement(domReference)) {
        ancestors = getOverflowAncestors(domReference);
      }

      if (isElement(floating)) {
        ancestors = ancestors.concat(getOverflowAncestors(floating));
      }

      // if (!isElement(domReference) && domReference && domReference.contextElement) {
      //   ancestors = ancestors.concat(
      //     getOverflowAncestors(reference.contextElement)
      //   );
      // }
    }

    // Ignore the visual viewport for scrolling dismissal (allow pinch-zoom)
    ancestors = ancestors.filter(
      (ancestor) => ancestor !== doc.defaultView?.visualViewport
    );

    ancestors.forEach((ancestor) => {
      ancestor.addEventListener('scroll', onScroll, {passive: true});
    });
    //Cleanup !!
    onCleanup(() => {
      escapeKey() && doc.removeEventListener('keydown', closeOnEscapeKeyDown);
      outsidePress &&
        doc.removeEventListener(outsidePressEvent(), closeOnPressOutside);
      ancestors.forEach((ancestor) => {
        ancestor.removeEventListener('scroll', onScroll);
      });
    });
  });

  // React.useEffect(() => {
  //   insideReactTreeRef.current = false;
  // }, [outsidePress, outsidePressEvent]);

  if (!enabled()) return {};

  return {
    reference: {
      onKeyDown: closeOnEscapeKeyDown,
      [bubbleHandlerKeys[referencePressEvent()]]: (event: Event) => {
        if (referencePress()) {
          events().emit('dismiss', {
            type: 'referencePress',
            data: {returnFocus: false},
          });
          onOpenChange()(false, event);
        }
      },
    },
    floating: {
      onKeyDown: closeOnEscapeKeyDown,
      [captureHandlerKeys[outsidePressEvent()]]: () => {
        insideReactTreeRef = true;
      },
    },
  };
}
