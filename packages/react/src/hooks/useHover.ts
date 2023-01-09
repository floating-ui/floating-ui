import * as React from 'react';
import useLayoutEffect from 'use-isomorphic-layout-effect';

import {useFloatingTree} from '../components/FloatingTree';
import {destroyPolygon} from '../safePolygon';
import type {
  ElementProps,
  FloatingContext,
  FloatingTreeType,
  ReferenceType,
} from '../types';
import {getDocument} from '../utils/getDocument';
import {isElement, isMouseLikePointerType} from '../utils/is';
import {useLatestRef} from './utils/useLatestRef';

export interface HandleCloseFn<RT extends ReferenceType = ReferenceType> {
  (
    context: FloatingContext<RT> & {
      onClose: () => void;
      tree?: FloatingTreeType<RT> | null;
      leave?: boolean;
      polygonRef: React.MutableRefObject<SVGElement | null>;
    }
  ): (event: MouseEvent) => void;
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
    if (handlerRef.current) {
      getDocument(floating).removeEventListener(
        'mousemove',
        handlerRef.current
      );
      handlerRef.current = undefined;
    }
  }, [floating]);

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

      const doc = getDocument(floating);
      clearTimeout(restTimeoutRef.current);

      if (handleCloseRef.current) {
        clearTimeout(timeoutRef.current);

        handlerRef.current &&
          doc.removeEventListener('mousemove', handlerRef.current);

        handlerRef.current = handleCloseRef.current({
          ...context,
          tree,
          polygonRef,
          x: event.clientX,
          y: event.clientY,
          onClose() {
            cleanupMouseMoveHandler();
            closeWithDelay();
          },
        });

        doc.addEventListener('mousemove', handlerRef.current);
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
        onClose() {
          cleanupMouseMoveHandler();
          closeWithDelay();
        },
      })(event);
    }

    if (isElement(domReference)) {
      const ref = domReference as unknown as HTMLElement;
      open && ref.addEventListener('mouseleave', onScrollMouseLeave);
      floating?.addEventListener('mouseleave', onScrollMouseLeave);
      move && ref.addEventListener('mousemove', onMouseEnter, {once: true});
      ref.addEventListener('mouseenter', onMouseEnter);
      ref.addEventListener('mouseleave', onMouseLeave);
      return () => {
        open && ref.removeEventListener('mouseleave', onScrollMouseLeave);
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
  ]);

  useLayoutEffect(() => {
    if (!open) {
      pointerTypeRef.current = undefined;
      cleanupMouseMoveHandler();
      destroyPolygon(polygonRef);
    }
  }, [open, cleanupMouseMoveHandler]);

  React.useEffect(() => {
    return () => {
      cleanupMouseMoveHandler();
      clearTimeout(timeoutRef.current);
      clearTimeout(restTimeoutRef.current);
      destroyPolygon(polygonRef);
    };
  }, [enabled, cleanupMouseMoveHandler]);

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
