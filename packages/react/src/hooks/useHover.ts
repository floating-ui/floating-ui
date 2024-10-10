import {
  contains,
  getDocument,
  isMouseLikePointerType,
} from '@floating-ui/react/utils';
import {isElement} from '@floating-ui/utils/dom';
import * as React from 'react';
import useModernLayoutEffect from 'use-isomorphic-layout-effect';

import {
  useFloatingParentNodeId,
  useFloatingTree,
} from '../components/FloatingTree';
import type {
  ElementProps,
  FloatingContext,
  FloatingRootContext,
  FloatingTreeType,
  OpenChangeReason,
} from '../types';
import {createAttribute} from '../utils/createAttribute';
import {useLatestRef} from './utils/useLatestRef';
import {useEffectEvent} from './utils/useEffectEvent';

const safePolygonIdentifier = createAttribute('safe-polygon');

export interface HandleCloseFn {
  (
    context: FloatingContext & {
      onClose: () => void;
      tree?: FloatingTreeType | null;
      leave?: boolean;
    },
  ): (event: MouseEvent) => void;
  __options: {
    blockPointerEvents: boolean;
  };
}

export function getDelay(
  value: UseHoverProps['delay'],
  prop: 'open' | 'close',
  pointerType?: PointerEvent['pointerType'],
) {
  if (pointerType && !isMouseLikePointerType(pointerType)) {
    return 0;
  }

  if (typeof value === 'number') {
    return value;
  }

  return value?.[prop];
}

export interface UseHoverProps {
  /**
   * Whether the Hook is enabled, including all internal Effects and event
   * handlers.
   * @default true
   */
  enabled?: boolean;
  /**
   * Instead of closing the floating element when the cursor leaves its
   * reference, we can leave it open until a certain condition is satisfied,
   * e.g. to let them traverse into the floating element.
   * @default null
   */
  handleClose?: HandleCloseFn | null;
  /**
   * Waits until the user’s cursor is at “rest” over the reference element
   *  before changing the `open` state.
   * @default 0
   */
  restMs?: number;
  /**
   * Waits for the specified time when the event listener runs before changing
   * the `open` state.
   * @default 0
   */
  delay?: number | {open?: number; close?: number};
  /**
   * Whether the logic only runs for mouse input, ignoring touch input.
   * Note: due to a bug with Linux Chrome, "pen" inputs are considered "mouse".
   * @default false
   */
  mouseOnly?: boolean;
  /**
   * Whether moving the cursor over the floating element will open it, without a
   * regular hover event required.
   * @default true
   */
  move?: boolean;
}

/**
 * Opens the floating element while hovering over the reference element, like
 * CSS `:hover`.
 * @see https://floating-ui.com/docs/useHover
 */
export function useHover(
  context: FloatingRootContext,
  props: UseHoverProps = {},
): ElementProps {
  const {open, onOpenChange, dataRef, events, elements} = context;
  const {
    enabled = true,
    delay = 0,
    handleClose = null,
    mouseOnly = false,
    restMs = 0,
    move = true,
  } = props;

  const tree = useFloatingTree();
  const parentId = useFloatingParentNodeId();
  const handleCloseRef = useLatestRef(handleClose);
  const delayRef = useLatestRef(delay);
  const openRef = useLatestRef(open);

  const pointerTypeRef = React.useRef<string>();
  const timeoutRef = React.useRef(-1);
  const handlerRef = React.useRef<(event: MouseEvent) => void>();
  const restTimeoutRef = React.useRef(-1);
  const blockMouseMoveRef = React.useRef(true);
  const performedPointerEventsMutationRef = React.useRef(false);
  const unbindMouseMoveRef = React.useRef(() => {});
  const restTimeoutPendingRef = React.useRef(false);

  const isHoverOpen = React.useCallback(() => {
    const type = dataRef.current.openEvent?.type;
    return type?.includes('mouse') && type !== 'mousedown';
  }, [dataRef]);

  // When closing before opening, clear the delay timeouts to cancel it
  // from showing.
  React.useEffect(() => {
    if (!enabled) return;

    function onOpenChange({open}: {open: boolean}) {
      if (!open) {
        clearTimeout(timeoutRef.current);
        clearTimeout(restTimeoutRef.current);
        blockMouseMoveRef.current = true;
        restTimeoutPendingRef.current = false;
      }
    }

    events.on('openchange', onOpenChange);
    return () => {
      events.off('openchange', onOpenChange);
    };
  }, [enabled, events]);

  React.useEffect(() => {
    if (!enabled) return;
    if (!handleCloseRef.current) return;
    if (!open) return;

    function onLeave(event: MouseEvent) {
      if (isHoverOpen()) {
        onOpenChange(false, event, 'hover');
      }
    }

    const html = getDocument(elements.floating).documentElement;
    html.addEventListener('mouseleave', onLeave);
    return () => {
      html.removeEventListener('mouseleave', onLeave);
    };
  }, [
    elements.floating,
    open,
    onOpenChange,
    enabled,
    handleCloseRef,
    isHoverOpen,
  ]);

  const closeWithDelay = React.useCallback(
    (
      event: Event,
      runElseBranch = true,
      reason: OpenChangeReason = 'hover',
    ) => {
      const closeDelay = getDelay(
        delayRef.current,
        'close',
        pointerTypeRef.current,
      );
      if (closeDelay && !handlerRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(
          () => onOpenChange(false, event, reason),
          closeDelay,
        );
      } else if (runElseBranch) {
        clearTimeout(timeoutRef.current);
        onOpenChange(false, event, reason);
      }
    },
    [delayRef, onOpenChange],
  );

  const cleanupMouseMoveHandler = useEffectEvent(() => {
    unbindMouseMoveRef.current();
    handlerRef.current = undefined;
  });

  const clearPointerEvents = useEffectEvent(() => {
    if (performedPointerEventsMutationRef.current) {
      const body = getDocument(elements.floating).body;
      body.style.pointerEvents = '';
      body.removeAttribute(safePolygonIdentifier);
      performedPointerEventsMutationRef.current = false;
    }
  });

  // Registering the mouse events on the reference directly to bypass React's
  // delegation system. If the cursor was on a disabled element and then entered
  // the reference (no gap), `mouseenter` doesn't fire in the delegation system.
  React.useEffect(() => {
    if (!enabled) return;

    function isClickLikeOpenEvent() {
      return dataRef.current.openEvent
        ? ['click', 'mousedown'].includes(dataRef.current.openEvent.type)
        : false;
    }

    function onMouseEnter(event: MouseEvent) {
      clearTimeout(timeoutRef.current);
      blockMouseMoveRef.current = false;

      if (
        (mouseOnly && !isMouseLikePointerType(pointerTypeRef.current)) ||
        (restMs > 0 && !getDelay(delayRef.current, 'open'))
      ) {
        return;
      }

      const openDelay = getDelay(
        delayRef.current,
        'open',
        pointerTypeRef.current,
      );

      if (openDelay) {
        timeoutRef.current = window.setTimeout(() => {
          if (!openRef.current) {
            onOpenChange(true, event, 'hover');
          }
        }, openDelay);
      } else {
        onOpenChange(true, event, 'hover');
      }
    }

    function onMouseLeave(event: MouseEvent) {
      if (isClickLikeOpenEvent()) return;

      unbindMouseMoveRef.current();

      const doc = getDocument(elements.floating);
      clearTimeout(restTimeoutRef.current);
      restTimeoutPendingRef.current = false;

      if (handleCloseRef.current && dataRef.current.floatingContext) {
        // Prevent clearing `onScrollMouseLeave` timeout.
        if (!open) {
          clearTimeout(timeoutRef.current);
        }

        handlerRef.current = handleCloseRef.current({
          ...dataRef.current.floatingContext,
          tree,
          x: event.clientX,
          y: event.clientY,
          onClose() {
            clearPointerEvents();
            cleanupMouseMoveHandler();
            closeWithDelay(event, true, 'safe-polygon');
          },
        });

        const handler = handlerRef.current;

        doc.addEventListener('mousemove', handler);
        unbindMouseMoveRef.current = () => {
          doc.removeEventListener('mousemove', handler);
        };

        return;
      }

      // Allow interactivity without `safePolygon` on touch devices. With a
      // pointer, a short close delay is an alternative, so it should work
      // consistently.
      const shouldClose =
        pointerTypeRef.current === 'touch'
          ? !contains(elements.floating, event.relatedTarget as Element | null)
          : true;
      if (shouldClose) {
        closeWithDelay(event);
      }
    }

    // Ensure the floating element closes after scrolling even if the pointer
    // did not move.
    // https://github.com/floating-ui/floating-ui/discussions/1692
    function onScrollMouseLeave(event: MouseEvent) {
      if (isClickLikeOpenEvent()) return;
      if (!dataRef.current.floatingContext) return;

      handleCloseRef.current?.({
        ...dataRef.current.floatingContext,
        tree,
        x: event.clientX,
        y: event.clientY,
        onClose() {
          clearPointerEvents();
          cleanupMouseMoveHandler();
          closeWithDelay(event);
        },
      })(event);
    }

    if (isElement(elements.domReference)) {
      const ref = elements.domReference as unknown as HTMLElement;
      open && ref.addEventListener('mouseleave', onScrollMouseLeave);
      elements.floating?.addEventListener('mouseleave', onScrollMouseLeave);
      move && ref.addEventListener('mousemove', onMouseEnter, {once: true});
      ref.addEventListener('mouseenter', onMouseEnter);
      ref.addEventListener('mouseleave', onMouseLeave);
      return () => {
        open && ref.removeEventListener('mouseleave', onScrollMouseLeave);
        elements.floating?.removeEventListener(
          'mouseleave',
          onScrollMouseLeave,
        );
        move && ref.removeEventListener('mousemove', onMouseEnter);
        ref.removeEventListener('mouseenter', onMouseEnter);
        ref.removeEventListener('mouseleave', onMouseLeave);
      };
    }
  }, [
    elements,
    enabled,
    context,
    mouseOnly,
    restMs,
    move,
    closeWithDelay,
    cleanupMouseMoveHandler,
    clearPointerEvents,
    onOpenChange,
    open,
    openRef,
    tree,
    delayRef,
    handleCloseRef,
    dataRef,
  ]);

  // Block pointer-events of every element other than the reference and floating
  // while the floating element is open and has a `handleClose` handler. Also
  // handles nested floating elements.
  // https://github.com/floating-ui/floating-ui/issues/1722
  useModernLayoutEffect(() => {
    if (!enabled) return;

    if (
      open &&
      handleCloseRef.current?.__options.blockPointerEvents &&
      isHoverOpen()
    ) {
      performedPointerEventsMutationRef.current = true;
      const floatingEl = elements.floating;

      if (isElement(elements.domReference) && floatingEl) {
        const body = getDocument(elements.floating).body;
        body.setAttribute(safePolygonIdentifier, '');

        const ref = elements.domReference as unknown as
          | HTMLElement
          | SVGSVGElement;

        const parentFloating = tree?.nodesRef.current.find(
          (node) => node.id === parentId,
        )?.context?.elements.floating;

        if (parentFloating) {
          parentFloating.style.pointerEvents = '';
        }

        body.style.pointerEvents = 'none';
        ref.style.pointerEvents = 'auto';
        floatingEl.style.pointerEvents = 'auto';

        return () => {
          body.style.pointerEvents = '';
          ref.style.pointerEvents = '';
          floatingEl.style.pointerEvents = '';
        };
      }
    }
  }, [enabled, open, parentId, elements, tree, handleCloseRef, isHoverOpen]);

  useModernLayoutEffect(() => {
    if (!open) {
      pointerTypeRef.current = undefined;
      restTimeoutPendingRef.current = false;
      cleanupMouseMoveHandler();
      clearPointerEvents();
    }
  }, [open, cleanupMouseMoveHandler, clearPointerEvents]);

  React.useEffect(() => {
    return () => {
      cleanupMouseMoveHandler();
      clearTimeout(timeoutRef.current);
      clearTimeout(restTimeoutRef.current);
      clearPointerEvents();
    };
  }, [
    enabled,
    elements.domReference,
    cleanupMouseMoveHandler,
    clearPointerEvents,
  ]);

  const reference: ElementProps['reference'] = React.useMemo(() => {
    function setPointerRef(event: React.PointerEvent) {
      pointerTypeRef.current = event.pointerType;
    }

    return {
      onPointerDown: setPointerRef,
      onPointerEnter: setPointerRef,
      onMouseMove(event) {
        const {nativeEvent} = event;

        function handleMouseMove() {
          if (!blockMouseMoveRef.current && !openRef.current) {
            onOpenChange(true, nativeEvent, 'hover');
          }
        }

        if (mouseOnly && !isMouseLikePointerType(pointerTypeRef.current)) {
          return;
        }

        if (open || restMs === 0) {
          return;
        }

        // Ignore insignificant movements to account for tremors.
        if (
          restTimeoutPendingRef.current &&
          event.movementX ** 2 + event.movementY ** 2 < 2
        ) {
          return;
        }

        clearTimeout(restTimeoutRef.current);

        if (pointerTypeRef.current === 'touch') {
          handleMouseMove();
        } else {
          restTimeoutPendingRef.current = true;
          restTimeoutRef.current = window.setTimeout(handleMouseMove, restMs);
        }
      },
    };
  }, [mouseOnly, onOpenChange, open, openRef, restMs]);

  const floating: ElementProps['floating'] = React.useMemo(
    () => ({
      onMouseEnter() {
        clearTimeout(timeoutRef.current);
      },
      onMouseLeave(event) {
        closeWithDelay(event.nativeEvent, false);
      },
    }),
    [closeWithDelay],
  );

  return React.useMemo(
    () => (enabled ? {reference, floating} : {}),
    [enabled, reference, floating],
  );
}
