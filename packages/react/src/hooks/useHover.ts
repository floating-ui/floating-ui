import * as React from 'react';
import useLayoutEffect from 'use-isomorphic-layout-effect';

import {useFloatingTree} from '../components/FloatingTree';
import {destroyPolygon, SafePolygonOptions} from '../safePolygon';
import type {
  ElementProps,
  FloatingContext,
  FloatingTreeType,
  ReferenceType,
} from '../types';
import {getDocument} from '../utils/getDocument';
import {isElement, isMouseLikePointerType, isSafari} from '../utils/is';
import {useLatestRef} from './utils/useLatestRef';

export interface HandleCloseFn<RT extends ReferenceType = ReferenceType> {
  (
    context: FloatingContext<RT> & {
      onClose: () => void;
      tree?: FloatingTreeType<RT> | null;
      leave?: boolean;
      polygonRef: React.MutableRefObject<SVGElement | null>;
      ignore: boolean;
    }
  ): (event: MouseEvent) => void;
  __options: SafePolygonOptions;
}

export function getDelay(
  value: Props['delay'],
  prop: 'open' | 'close',
  pointerType?: PointerEvent['pointerType']
) {
  if (pointerType && !isMouseLikePointerType(pointerType)) {
    return 0;
  }

  if (typeof value === 'number') {
    return value;
  }

  return value?.[prop];
}

export interface Props<RT extends ReferenceType = ReferenceType> {
  enabled?: boolean;
  handleClose?: HandleCloseFn<RT> | null;
  restMs?: number;
  delay?: number | Partial<{open: number; close: number}>;
  mouseOnly?: boolean;
  move?: boolean;
}

/**
 * Adds hover event listeners that change the open state, like CSS :hover.
 * @see https://floating-ui.com/docs/useHover
 */
export const useHover = <RT extends ReferenceType = ReferenceType>(
  context: FloatingContext<RT>,
  {
    enabled = true,
    delay = 0,
    handleClose = null,
    mouseOnly = false,
    restMs = 0,
    move = true,
  }: Props<RT> = {}
): ElementProps => {
  const {
    open,
    onOpenChange,
    dataRef,
    events,
    elements: {domReference, floating},
  } = context;

  const tree = useFloatingTree<RT>();
  const handleCloseRef = useLatestRef(handleClose);
  const delayRef = useLatestRef(delay);

  const pointerTypeRef = React.useRef<string>();
  const timeoutRef = React.useRef<any>();
  const handlerRef = React.useRef<(event: MouseEvent) => void>();
  const restTimeoutRef = React.useRef<any>();
  const blockMouseMoveRef = React.useRef(true);
  const polygonRef = React.useRef<SVGElement | null>(null);
  const unbindMouseMoveRef = React.useRef(() => {});
  const cleanupInitialBlockingElementsRef = React.useRef(() => {});
  const initialElementsCreatedRef = React.useRef(false);
  const hasIntentRef = React.useRef(false);
  const prevTimeRef = React.useRef(0);
  const prevCoordsRef = React.useRef({x: -1, y: -1});

  const isHoverOpen = React.useCallback(() => {
    const type = dataRef.current.openEvent?.type;
    return type?.includes('mouse') && type !== 'mousedown';
  }, [dataRef]);

  // When dismissing before opening, clear the delay timeouts to cancel it
  // from showing.
  React.useEffect(() => {
    if (!enabled) {
      return;
    }

    function onDismiss() {
      clearTimeout(timeoutRef.current);
      clearTimeout(restTimeoutRef.current);
      blockMouseMoveRef.current = true;
    }

    events.on('dismiss', onDismiss);
    return () => {
      events.off('dismiss', onDismiss);
    };
  }, [enabled, events]);

  React.useEffect(() => {
    if (!enabled || !handleCloseRef.current || !open) {
      return;
    }

    function onLeave() {
      if (isHoverOpen()) {
        onOpenChange(false);
      }
    }

    const html = getDocument(floating).documentElement;
    html.addEventListener('mouseleave', onLeave);
    return () => {
      html.removeEventListener('mouseleave', onLeave);
    };
  }, [
    floating,
    open,
    onOpenChange,
    enabled,
    handleCloseRef,
    dataRef,
    isHoverOpen,
  ]);

  const closeWithDelay = React.useCallback(
    (runElseBranch = true) => {
      const closeDelay = getDelay(
        delayRef.current,
        'close',
        pointerTypeRef.current
      );
      if (closeDelay && !handlerRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => onOpenChange(false), closeDelay);
      } else if (runElseBranch) {
        clearTimeout(timeoutRef.current);
        onOpenChange(false);
      }
    },
    [delayRef, onOpenChange]
  );

  const cleanupMouseMoveHandler = React.useCallback(() => {
    unbindMouseMoveRef.current();
    handlerRef.current = undefined;
  }, []);

  const cleanupInitialBlockingElements = React.useCallback(
    (cleanup?: () => void) => {
      if (cleanup) {
        cleanup();
      } else {
        cleanupInitialBlockingElementsRef.current();
      }
      initialElementsCreatedRef.current = false;
    },
    []
  );

  const createInitialBlockingElements = React.useCallback(
    (event: MouseEvent) => {
      if (!domReference) return;

      const {top, right, bottom, left, width} =
        domReference.getBoundingClientRect();

      const vV = getDocument(domReference).defaultView?.visualViewport;
      const addVisualOffsets = isSafari();
      const leftOffset = addVisualOffsets ? vV?.offsetLeft || 0 : 0;
      const topOffset = addVisualOffsets ? vV?.offsetTop || 0 : 0;

      if (
        event.clientY <= top ||
        event.clientX >= right ||
        event.clientY >= bottom ||
        event.clientX <= left
      ) {
        return;
      }

      const doc = getDocument(domReference);
      const topNode = doc.createElement('div');
      const rightNode = doc.createElement('div');
      const bottomNode = doc.createElement('div');
      const leftNode = doc.createElement('div');
      const viewportWidth = doc.documentElement.clientWidth;
      const viewportHeight = doc.documentElement.clientHeight;

      const commonStyles = {
        position: 'fixed',
        background: 'none',
        opacity: 0,
        zIndex: 2147483647,
      };

      Object.assign(topNode.style, {
        ...commonStyles,
        top: `${topOffset}px`,
        left: `${left + leftOffset}px`,
        width: `${width}px`,
        height: `${top}px`,
      });

      Object.assign(rightNode.style, {
        ...commonStyles,
        top: `${topOffset}px`,
        left: `${right + leftOffset}px`,
        width: `${viewportWidth - right}px`,
        height: `${viewportHeight}px`,
      });

      Object.assign(bottomNode.style, {
        ...commonStyles,
        top: `${bottom + topOffset}px`,
        left: `${left + leftOffset}px`,
        width: `${width}px`,
        height: `${viewportHeight - bottom}px`,
      });

      Object.assign(leftNode.style, {
        ...commonStyles,
        top: `${topOffset}px`,
        left: `${leftOffset}px`,
        width: `${left}px`,
        height: `${viewportHeight}px`,
      });

      doc.body.appendChild(topNode);
      doc.body.appendChild(rightNode);
      doc.body.appendChild(bottomNode);
      doc.body.appendChild(leftNode);

      return () => {
        topNode.remove();
        rightNode.remove();
        bottomNode.remove();
        leftNode.remove();
      };
    },
    [domReference]
  );

  // Registering the mouse events on the reference directly to bypass React's
  // delegation system. If the cursor was on a disabled element and then entered
  // the reference (no gap), `mouseenter` doesn't fire in the delegation system.
  React.useEffect(() => {
    if (!enabled) {
      return;
    }

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
        (restMs > 0 && getDelay(delayRef.current, 'open') === 0)
      ) {
        return;
      }

      dataRef.current.openEvent = event;

      const openDelay = getDelay(
        delayRef.current,
        'open',
        pointerTypeRef.current
      );

      if (openDelay) {
        timeoutRef.current = setTimeout(() => {
          onOpenChange(true);
        }, openDelay);
      } else {
        onOpenChange(true);
      }
    }

    function onMouseLeave(event: MouseEvent) {
      if (isClickLikeOpenEvent()) {
        return;
      }

      unbindMouseMoveRef.current();

      const doc = getDocument(floating);
      clearTimeout(restTimeoutRef.current);

      if (handleCloseRef.current) {
        clearTimeout(timeoutRef.current);

        handlerRef.current = handleCloseRef.current({
          ...context,
          tree,
          polygonRef,
          ignore: !hasIntentRef.current,
          x: event.clientX,
          y: event.clientY,
          onClose() {
            cleanupMouseMoveHandler();
            closeWithDelay();
          },
        });

        // Make sure the polygon has painted before removing the nodes.
        const cleanupFn = cleanupInitialBlockingElementsRef.current;
        setTimeout(() => {
          cleanupInitialBlockingElements(cleanupFn);
        });

        const handler = handlerRef.current;

        doc.addEventListener('mousemove', handler);
        unbindMouseMoveRef.current = () => {
          doc.removeEventListener('mousemove', handler);
        };

        return;
      }

      closeWithDelay();
    }

    // Ensure the floating element closes after scrolling even if the pointer
    // did not move.
    // https://github.com/floating-ui/floating-ui/discussions/1692
    function onScrollMouseLeave(event: MouseEvent) {
      if (isClickLikeOpenEvent()) {
        return;
      }

      handleCloseRef.current?.({
        ...context,
        tree,
        polygonRef,
        x: event.clientX,
        y: event.clientY,
        ignore: !hasIntentRef.current,
        onClose() {
          cleanupMouseMoveHandler();
          closeWithDelay();
        },
      })(event);
    }

    function handleIntentCheck(event: MouseEvent) {
      if (!handleCloseRef.current) return;

      const safePolygonOptions = handleCloseRef.current.__options;

      if (!safePolygonOptions.blockPointerEvents) {
        hasIntentRef.current = true;
        return;
      }

      const now = Date.now();
      const currentCoords = {x: event.clientX, y: event.clientY};
      const prevCoords = prevCoordsRef.current;

      const distanceBetweenPoints = Math.sqrt(
        Math.pow(currentCoords.x - prevCoords.x, 2) +
          Math.pow(currentCoords.y - prevCoords.y, 2)
      );
      const speed = distanceBetweenPoints / (now - prevTimeRef.current);

      prevCoordsRef.current = currentCoords;
      prevTimeRef.current = now;

      hasIntentRef.current = safePolygonOptions.requireIntent
        ? speed >= 0.15
        : true;

      if (hasIntentRef.current && !initialElementsCreatedRef.current) {
        const cleanup = createInitialBlockingElements(event);
        if (cleanup) {
          initialElementsCreatedRef.current = true;
          cleanupInitialBlockingElementsRef.current = cleanup;
        }
      }
    }

    if (isElement(domReference)) {
      const ref = domReference as unknown as HTMLElement;
      open && ref.addEventListener('mouseleave', onScrollMouseLeave);
      open && ref.addEventListener('mousemove', handleIntentCheck);
      floating?.addEventListener('mouseleave', onScrollMouseLeave);
      move && ref.addEventListener('mousemove', onMouseEnter, {once: true});
      ref.addEventListener('mouseenter', onMouseEnter);
      ref.addEventListener('mouseleave', onMouseLeave);
      return () => {
        open && ref.removeEventListener('mouseleave', onScrollMouseLeave);
        open && ref.removeEventListener('mousemove', handleIntentCheck);
        floating?.removeEventListener('mouseleave', onScrollMouseLeave);
        move && ref.removeEventListener('mousemove', onMouseEnter);
        ref.removeEventListener('mouseenter', onMouseEnter);
        ref.removeEventListener('mouseleave', onMouseLeave);
      };
    }
  }, [
    domReference,
    floating,
    enabled,
    context,
    mouseOnly,
    restMs,
    move,
    closeWithDelay,
    cleanupMouseMoveHandler,
    onOpenChange,
    open,
    tree,
    delayRef,
    handleCloseRef,
    dataRef,
    createInitialBlockingElements,
    cleanupInitialBlockingElements,
  ]);

  useLayoutEffect(() => {
    if (!open) {
      pointerTypeRef.current = undefined;
      cleanupMouseMoveHandler();
      cleanupInitialBlockingElements();
      destroyPolygon(polygonRef);
    }
  }, [open, cleanupMouseMoveHandler, cleanupInitialBlockingElements]);

  React.useEffect(() => {
    return () => {
      cleanupMouseMoveHandler();
      clearTimeout(timeoutRef.current);
      clearTimeout(restTimeoutRef.current);
      cleanupInitialBlockingElements();
      destroyPolygon(polygonRef);
    };
  }, [enabled, cleanupMouseMoveHandler, cleanupInitialBlockingElements]);

  return React.useMemo(() => {
    if (!enabled) {
      return {};
    }

    function setPointerRef(event: React.PointerEvent) {
      pointerTypeRef.current = event.pointerType;
    }

    return {
      reference: {
        onPointerDown: setPointerRef,
        onPointerEnter: setPointerRef,
        onMouseMove() {
          if (open || restMs === 0) {
            return;
          }

          clearTimeout(restTimeoutRef.current);
          restTimeoutRef.current = setTimeout(() => {
            if (!blockMouseMoveRef.current) {
              onOpenChange(true);
            }
          }, restMs);
        },
      },
      floating: {
        onMouseEnter() {
          clearTimeout(timeoutRef.current);
        },
        onMouseLeave() {
          events.emit('dismiss', {
            type: 'mouseLeave',
            data: {
              returnFocus: false,
            },
          });
          closeWithDelay(false);
        },
      },
    };
  }, [events, enabled, restMs, open, onOpenChange, closeWithDelay]);
};
