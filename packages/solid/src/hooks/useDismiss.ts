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
  isRootElement,
  isVirtualClick,
  isVirtualPointerEvent,
} from '../utils';
import {access, MaybeAccessor} from '@solid-primitives/utils';
import {
  Accessor,
  batch,
  createEffect,
  createMemo,
  createSignal,
  mergeProps,
  onCleanup,
} from 'solid-js';

import {usePortalContext} from '../components/FloatingPortal';
import {
  useFloatingParentNodeId,
  useFloatingTree,
  useUnsafeFloatingTree,
} from '../components/FloatingTree';
import type {ElementProps, FloatingContext, ReferenceType} from '../types';
import {createAttribute} from '../utils/createAttribute';
import {destructure} from '../utils/destructure';
import {getChildren} from '../utils/getChildren';

const bubbleHandlerKeys = {
  pointerdown: 'onPointerDown',
  mousedown: 'onMouseDown',
  click: 'onClick',
};

const captureHandlerKeys = {
  pointerdown: 'oncapture:pointerdown',
  mousedown: 'oncapture:mousedown',
  click: 'oncapture:click',
};

export const normalizeBubblesProp = (_bubbles?: UseDismissProps['bubbles']) => {
  const bubbles = access(_bubbles);
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

const defaultUseDismissProps: Required<UseDismissProps> = {
  enabled: true,
  escapeKey: true,
  outsidePress: true,
  outsidePressEvent: 'pointerdown',
  referencePress: false,
  referencePressEvent: 'pointerdown',
  ancestorScroll: false,
  bubbles: null,
};
export interface UseDismissProps {
  enabled?: MaybeAccessor<boolean>;
  escapeKey?: MaybeAccessor<boolean>;
  referencePress?: MaybeAccessor<boolean>;
  referencePressEvent?: MaybeAccessor<'pointerdown' | 'mousedown' | 'click'>;
  outsidePress?: MaybeAccessor<boolean> | ((event: MouseEvent) => boolean);
  outsidePressEvent?: MaybeAccessor<'pointerdown' | 'mousedown' | 'click'>;
  ancestorScroll?: MaybeAccessor<boolean>;
  bubbles?: MaybeAccessor<
    boolean | {escapeKey?: boolean; outsidePress?: boolean} | null
  >;
}

/**
 * Closes the floating element when a dismissal is requested — by default, when
 * the user presses the `escape` key or outside of the floating element.
 * @see https://floating-ui.com/docs/useDismiss
 */
export function useDismiss<RT extends ReferenceType = ReferenceType>(
  context: Accessor<FloatingContext<RT>>,
  props?: UseDismissProps,
): Accessor<ElementProps> {
  const {open, events, nodeId} = destructure(context, {
    normalize: true,
  });
  const {onOpenChange} = context();
  const mergedProps = mergeProps(
    defaultUseDismissProps,
    props,
  ) as Required<UseDismissProps>;

  const {
    enabled,
    escapeKey,
    outsidePressEvent,
    referencePress,
    referencePressEvent,
    ancestorScroll,
    bubbles,
  } = destructure(mergedProps, {memo: true, normalize: true});

  const {outsidePress: unstable_outsidePress} = mergedProps;
  const tree = useUnsafeFloatingTree();

  const nested = useFloatingParentNodeId() != null;
  const outsidePressFn =
    typeof unstable_outsidePress === 'function'
      ? unstable_outsidePress
      : () => false;

  const outsidePress =
    typeof unstable_outsidePress === 'function'
      ? outsidePressFn
      : unstable_outsidePress;

  // let insideReactTreeRef = false;
  const [insideReactTreeRef, setInsideReactTreeRef] = createSignal(false);

  const {escapeKeyBubbles, outsidePressBubbles} = destructure(() =>
    normalizeBubblesProp(bubbles),
  );

  const closeOnEscapeKeyDown = (event: KeyboardEvent) => {
    if (!open() || !enabled() || !escapeKey() || event.key !== 'Escape') {
      return;
    }
    const children = tree?.() ? getChildren(tree().nodesRef, nodeId()) : [];

    if (!escapeKeyBubbles()) {
      event.stopPropagation();
      event.stopImmediatePropagation();

      if (children.length > 0) {
        let shouldDismiss = true;

        children.forEach((child) => {
          if (
            child.context?.open() &&
            !child.context.dataRef.__escapeKeyBubbles?.()
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

    onOpenChange(false, event);
  };

  const closeOnPressOutside = (event: MouseEvent) => {
    // Given developers can stop the propagation of the synthetic event,
    // we can only be confident with a positive value.
    const insideReactTree = insideReactTreeRef();
    setInsideReactTreeRef(false);
    if (insideReactTree) {
      return;
    }

    if (typeof outsidePress === 'function' && !outsidePress(event)) {
      return;
    }

    const target = getTarget(event);
    const floating = context().refs.floating();
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
        (marker) => !contains(targetRootAncestor, marker),
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
      tree?.() &&
      getChildren(tree().nodesRef, nodeId()).some((node) =>
        isEventTargetWithin(event, node.context?.refs.floating()),
      );
    const domRef = context().refs.reference() as HTMLElement | null;

    if (
      isEventTargetWithin(event, floating) ||
      isEventTargetWithin(event, domRef) ||
      targetIsInsideChildren
    ) {
      return;
    }
    const children = tree?.() ? getChildren(tree().nodesRef, nodeId()) : [];

    if (children.length > 0) {
      let shouldDismiss = true;

      children.forEach((child) => {
        if (
          child.context?.open() &&
          !child.context.dataRef.__outsidePressBubbles?.()
        ) {
          shouldDismiss = false;
          return;
        }
      });

      if (!shouldDismiss) {
        return;
      }
    }

    context().events.emit('dismiss', {
      type: 'outsidePress',
      data: {
        returnFocus: nested
          ? {preventScroll: true}
          : isVirtualClick(event) ||
            isVirtualPointerEvent(event as PointerEvent),
      },
    });

    onOpenChange(false, event);
  };

  let ancestors: (Element | Window | VisualViewport)[] = [];

  function onScroll(event: Event) {
    onOpenChange(false, event);
  }

  //onMount ??
  createEffect(() => {
    if (!open() || !enabled()) {
      return;
    }

    const {floating, reference} = context().refs;
    const domReference = reference() as Node | null;
    batch(() => {
      context().dataRef.__escapeKeyBubbles = escapeKeyBubbles;
      context().dataRef.__outsidePressBubbles = outsidePressBubbles;
    });
    const doc = getDocument(floating());
    escapeKey() && doc.addEventListener('keydown', closeOnEscapeKeyDown);
    outsidePress &&
      doc.addEventListener(outsidePressEvent(), closeOnPressOutside);

    if (ancestorScroll()) {
      if (isElement(domReference)) {
        ancestors = getOverflowAncestors(domReference);
      }

      if (isElement(floating())) {
        ancestors = ancestors.concat(getOverflowAncestors(floating()!));
      }

      // if (!isElement(domReference) && domReference && domReference.contextElement) {
      //   ancestors = ancestors.concat(
      //     getOverflowAncestors(domReference.contextElement)
      //   );
      // }
    }

    // Ignore the visual viewport for scrolling dismissal (allow pinch-zoom)
    ancestors = ancestors.filter(
      (ancestor) => ancestor !== doc.defaultView?.visualViewport,
    );

    ancestors.forEach((ancestor) => {
      ancestor.addEventListener('scroll', onScroll, {passive: true});
    });
    //Cleanup !!
    onCleanup(() => {
      const doc = getDocument(context().refs.floating());
      escapeKey() && doc.removeEventListener('keydown', closeOnEscapeKeyDown);
      outsidePress &&
        doc.removeEventListener(outsidePressEvent(), closeOnPressOutside);
      ancestors.forEach((ancestor) => {
        ancestor.removeEventListener('scroll', onScroll);
      });
    });
  });

  createEffect(() => {
    outsidePress;
    outsidePressEvent();
    // insideReactTreeRef = false;
    setInsideReactTreeRef(false);
  });

  return createMemo(() => {
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

            onOpenChange(false, event);
          }
        },
      },
      floating: {
        onKeyDown: closeOnEscapeKeyDown,
        // [captureHandlerKeys[outsidePressEvent()]]: () => {
        [bubbleHandlerKeys[outsidePressEvent()]]: () => {
          setInsideReactTreeRef(true);
        },
      },
    };
  });
}
