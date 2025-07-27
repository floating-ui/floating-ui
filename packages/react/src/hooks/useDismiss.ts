import * as React from 'react';
import {getOverflowAncestors} from '@floating-ui/react-dom';
import {
  getComputedStyle,
  getParentNode,
  isElement,
  isHTMLElement,
  isLastTraversableNode,
  isWebKit,
} from '@floating-ui/utils/dom';
import {
  contains,
  getDocument,
  getTarget,
  isEventTargetWithin,
  isReactEvent,
  isRootElement,
  useEffectEvent,
  getNodeChildren,
} from '@floating-ui/react/utils';

import {useFloatingTree} from '../components/FloatingTree';
import type {ElementProps, FloatingRootContext} from '../types';
import {createAttribute} from '../utils/createAttribute';

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

export const normalizeProp = (
  normalizable?: boolean | {escapeKey?: boolean; outsidePress?: boolean},
) => {
  return {
    escapeKey:
      typeof normalizable === 'boolean'
        ? normalizable
        : normalizable?.escapeKey ?? false,
    outsidePress:
      typeof normalizable === 'boolean'
        ? normalizable
        : normalizable?.outsidePress ?? true,
  };
};

export interface UseDismissProps {
  /**
   * Whether the Hook is enabled, including all internal Effects and event
   * handlers.
   * @default true
   */
  enabled?: boolean;
  /**
   * Whether to dismiss the floating element upon pressing the `esc` key.
   * @default true
   */
  escapeKey?: boolean;
  /**
   * Whether to dismiss the floating element upon pressing the reference
   * element. You likely want to ensure the `move` option in the `useHover()`
   * Hook has been disabled when this is in use.
   * @default false
   */
  referencePress?: boolean;
  /**
   * The type of event to use to determine a “press”.
   * - `pointerdown` is eager on both mouse + touch input.
   * - `mousedown` is eager on mouse input, but lazy on touch input.
   * - `click` is lazy on both mouse + touch input.
   * @default 'pointerdown'
   */
  referencePressEvent?: 'pointerdown' | 'mousedown' | 'click';
  /**
   * Whether to dismiss the floating element upon pressing outside of the
   * floating element.
   * If you have another element, like a toast, that is rendered outside the
   * floating element’s React tree and don’t want the floating element to close
   * when pressing it, you can guard the check like so:
   * ```jsx
   * useDismiss(context, {
   *   outsidePress: (event) => !event.target.closest('.toast'),
   * });
   * ```
   * @default true
   */
  outsidePress?: boolean | ((event: MouseEvent) => boolean);
  /**
   * The type of event to use to determine an outside “press”.
   * - `pointerdown` is eager on both mouse + touch input.
   * - `mousedown` is eager on mouse input, but lazy on touch input.
   * - `click` is lazy on both mouse + touch input.
   * @default 'pointerdown'
   */
  outsidePressEvent?: 'pointerdown' | 'mousedown' | 'click';
  /**
   * Whether to dismiss the floating element upon scrolling an overflow
   * ancestor.
   * @default false
   */
  ancestorScroll?: boolean;
  /**
   * Determines whether event listeners bubble upwards through a tree of
   * floating elements.
   */
  bubbles?: boolean | {escapeKey?: boolean; outsidePress?: boolean};
  /**
   * Determines whether to use capture phase event listeners.
   */
  capture?: boolean | {escapeKey?: boolean; outsidePress?: boolean};
}

/**
 * Closes the floating element when a dismissal is requested — by default, when
 * the user presses the `escape` key or outside of the floating element.
 * @see https://floating-ui.com/docs/useDismiss
 */
export function useDismiss(
  context: FloatingRootContext,
  props: UseDismissProps = {},
): ElementProps {
  const {open, onOpenChange, elements, dataRef} = context;
  const {
    enabled = true,
    escapeKey = true,
    outsidePress: unstable_outsidePress = true,
    outsidePressEvent = 'pointerdown',
    referencePress = false,
    referencePressEvent = 'pointerdown',
    ancestorScroll = false,
    bubbles,
    capture,
  } = props;

  const tree = useFloatingTree();
  const outsidePressFn = useEffectEvent(
    typeof unstable_outsidePress === 'function'
      ? unstable_outsidePress
      : () => false,
  );
  const outsidePress =
    typeof unstable_outsidePress === 'function'
      ? outsidePressFn
      : unstable_outsidePress;

  const endedOrStartedInsideRef = React.useRef(false);
  const {escapeKey: escapeKeyBubbles, outsidePress: outsidePressBubbles} =
    normalizeProp(bubbles);
  const {escapeKey: escapeKeyCapture, outsidePress: outsidePressCapture} =
    normalizeProp(capture);

  const isComposingRef = React.useRef(false);

  const closeOnEscapeKeyDown = useEffectEvent(
    (event: React.KeyboardEvent<Element> | KeyboardEvent) => {
      if (!open || !enabled || !escapeKey || event.key !== 'Escape') {
        return;
      }

      // Wait until IME is settled. Pressing `Escape` while composing should
      // close the compose menu, but not the floating element.
      if (isComposingRef.current) {
        return;
      }

      const nodeId = dataRef.current.floatingContext?.nodeId;

      const children = tree
        ? getNodeChildren(tree.nodesRef.current, nodeId)
        : [];

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

      onOpenChange(
        false,
        isReactEvent(event) ? event.nativeEvent : event,
        'escape-key',
      );
    },
  );

  const closeOnEscapeKeyDownCapture = useEffectEvent((event: KeyboardEvent) => {
    const callback = () => {
      closeOnEscapeKeyDown(event);
      getTarget(event)?.removeEventListener('keydown', callback);
    };
    getTarget(event)?.addEventListener('keydown', callback);
  });

  const closeOnPressOutside = useEffectEvent((event: MouseEvent) => {
    // Given developers can stop the propagation of the synthetic event,
    // we can only be confident with a positive value.
    const insideReactTree = dataRef.current.insideReactTree;
    dataRef.current.insideReactTree = false;

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
    const markers = getDocument(elements.floating).querySelectorAll(
      inertSelector,
    );

    let targetRootAncestor = isElement(target) ? target : null;
    while (targetRootAncestor && !isLastTraversableNode(targetRootAncestor)) {
      const nextParent = getParentNode(targetRootAncestor);
      if (isLastTraversableNode(nextParent) || !isElement(nextParent)) {
        break;
      }

      targetRootAncestor = nextParent;
    }

    // Check if the click occurred on a third-party element injected after the
    // floating element rendered.
    if (
      markers.length &&
      isElement(target) &&
      !isRootElement(target) &&
      // Clicked on a direct ancestor (e.g. FloatingOverlay).
      !contains(target, elements.floating) &&
      // If the target root element contains none of the markers, then the
      // element was injected after the floating element rendered.
      Array.from(markers).every(
        (marker) => !contains(targetRootAncestor, marker),
      )
    ) {
      return;
    }

    // Check if the click occurred on the scrollbar
    if (isHTMLElement(target) && floating) {
      const lastTraversableNode = isLastTraversableNode(target);
      const style = getComputedStyle(target);
      const scrollRe = /auto|scroll/;
      const isScrollableX =
        lastTraversableNode || scrollRe.test(style.overflowX);
      const isScrollableY =
        lastTraversableNode || scrollRe.test(style.overflowY);

      const canScrollX =
        isScrollableX &&
        target.clientWidth > 0 &&
        target.scrollWidth > target.clientWidth;
      const canScrollY =
        isScrollableY &&
        target.clientHeight > 0 &&
        target.scrollHeight > target.clientHeight;

      const isRTL = style.direction === 'rtl';

      // Check click position relative to scrollbar.
      // In some browsers it is possible to change the <body> (or window)
      // scrollbar to the left side, but is very rare and is difficult to
      // check for. Plus, for modal dialogs with backdrops, it is more
      // important that the backdrop is checked but not so much the window.
      const pressedVerticalScrollbar =
        canScrollY &&
        (isRTL
          ? event.offsetX <= target.offsetWidth - target.clientWidth
          : event.offsetX > target.clientWidth);

      const pressedHorizontalScrollbar =
        canScrollX && event.offsetY > target.clientHeight;

      if (pressedVerticalScrollbar || pressedHorizontalScrollbar) {
        return;
      }
    }

    const nodeId = dataRef.current.floatingContext?.nodeId;

    const targetIsInsideChildren =
      tree &&
      getNodeChildren(tree.nodesRef.current, nodeId).some((node) =>
        isEventTargetWithin(event, node.context?.elements.floating),
      );

    if (
      isEventTargetWithin(event, elements.floating) ||
      isEventTargetWithin(event, elements.domReference) ||
      targetIsInsideChildren
    ) {
      return;
    }

    const children = tree ? getNodeChildren(tree.nodesRef.current, nodeId) : [];
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

    onOpenChange(false, event, 'outside-press');
  });

  const closeOnPressOutsideCapture = useEffectEvent((event: MouseEvent) => {
    const callback = () => {
      closeOnPressOutside(event);
      getTarget(event)?.removeEventListener(outsidePressEvent, callback);
    };
    getTarget(event)?.addEventListener(outsidePressEvent, callback);
  });

  React.useEffect(() => {
    if (!open || !enabled) {
      return;
    }

    dataRef.current.__escapeKeyBubbles = escapeKeyBubbles;
    dataRef.current.__outsidePressBubbles = outsidePressBubbles;

    let compositionTimeout = -1;

    function onScroll(event: Event) {
      onOpenChange(false, event, 'ancestor-scroll');
    }

    function handleCompositionStart() {
      window.clearTimeout(compositionTimeout);
      isComposingRef.current = true;
    }

    function handleCompositionEnd() {
      // Safari fires `compositionend` before `keydown`, so we need to wait
      // until the next tick to set `isComposing` to `false`.
      // https://bugs.webkit.org/show_bug.cgi?id=165004
      compositionTimeout = window.setTimeout(
        () => {
          isComposingRef.current = false;
        },
        // 0ms or 1ms don't work in Safari. 5ms appears to consistently work.
        // Only apply to WebKit for the test to remain 0ms.
        isWebKit() ? 5 : 0,
      );
    }

    const doc = getDocument(elements.floating);

    if (escapeKey) {
      doc.addEventListener(
        'keydown',
        escapeKeyCapture ? closeOnEscapeKeyDownCapture : closeOnEscapeKeyDown,
        escapeKeyCapture,
      );
      doc.addEventListener('compositionstart', handleCompositionStart);
      doc.addEventListener('compositionend', handleCompositionEnd);
    }

    outsidePress &&
      doc.addEventListener(
        outsidePressEvent,
        outsidePressCapture ? closeOnPressOutsideCapture : closeOnPressOutside,
        outsidePressCapture,
      );

    let ancestors: (Element | Window | VisualViewport)[] = [];

    if (ancestorScroll) {
      if (isElement(elements.domReference)) {
        ancestors = getOverflowAncestors(elements.domReference);
      }

      if (isElement(elements.floating)) {
        ancestors = ancestors.concat(getOverflowAncestors(elements.floating));
      }

      if (
        !isElement(elements.reference) &&
        elements.reference &&
        elements.reference.contextElement
      ) {
        ancestors = ancestors.concat(
          getOverflowAncestors(elements.reference.contextElement),
        );
      }
    }

    // Ignore the visual viewport for scrolling dismissal (allow pinch-zoom)
    ancestors = ancestors.filter(
      (ancestor) => ancestor !== doc.defaultView?.visualViewport,
    );

    ancestors.forEach((ancestor) => {
      ancestor.addEventListener('scroll', onScroll, {passive: true});
    });

    return () => {
      if (escapeKey) {
        doc.removeEventListener(
          'keydown',
          escapeKeyCapture ? closeOnEscapeKeyDownCapture : closeOnEscapeKeyDown,
          escapeKeyCapture,
        );
        doc.removeEventListener('compositionstart', handleCompositionStart);
        doc.removeEventListener('compositionend', handleCompositionEnd);
      }

      outsidePress &&
        doc.removeEventListener(
          outsidePressEvent,
          outsidePressCapture
            ? closeOnPressOutsideCapture
            : closeOnPressOutside,
          outsidePressCapture,
        );
      ancestors.forEach((ancestor) => {
        ancestor.removeEventListener('scroll', onScroll);
      });

      window.clearTimeout(compositionTimeout);
    };
  }, [
    dataRef,
    elements,
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
    escapeKeyCapture,
    closeOnEscapeKeyDownCapture,
    closeOnPressOutside,
    outsidePressCapture,
    closeOnPressOutsideCapture,
  ]);

  React.useEffect(() => {
    dataRef.current.insideReactTree = false;
  }, [dataRef, outsidePress, outsidePressEvent]);

  const reference: ElementProps['reference'] = React.useMemo(
    () => ({
      onKeyDown: closeOnEscapeKeyDown,
      ...(referencePress && {
        [bubbleHandlerKeys[referencePressEvent]]: (
          event: React.SyntheticEvent,
        ) => {
          onOpenChange(false, event.nativeEvent, 'reference-press');
        },
        ...(referencePressEvent !== 'click' && {
          onClick(event) {
            onOpenChange(false, event.nativeEvent, 'reference-press');
          },
        }),
      }),
    }),
    [closeOnEscapeKeyDown, onOpenChange, referencePress, referencePressEvent],
  );

  const floating: ElementProps['floating'] = React.useMemo(
    () => ({
      onKeyDown: closeOnEscapeKeyDown,
      onMouseDown() {
        endedOrStartedInsideRef.current = true;
      },
      onMouseUp() {
        endedOrStartedInsideRef.current = true;
      },
      [captureHandlerKeys[outsidePressEvent]]: () => {
        dataRef.current.insideReactTree = true;
      },
    }),
    [closeOnEscapeKeyDown, outsidePressEvent, dataRef],
  );

  return React.useMemo(
    () => (enabled ? {reference, floating} : {}),
    [enabled, reference, floating],
  );
}
