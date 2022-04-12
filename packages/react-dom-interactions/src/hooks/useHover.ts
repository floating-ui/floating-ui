import React, {useCallback, useEffect, useRef} from 'react';
import useLayoutEffect from 'use-isomorphic-layout-effect';
import {useFloatingTree} from '../FloatingTree';
import type {ElementProps, FloatingContext, FloatingTreeType} from '../types';
import {getDocument} from '../utils/getDocument';
import {isElement} from '../utils/is';
import {useLatestRef} from '../utils/useLatestRef';

export function getDelay(
  value: Props['delay'],
  prop: 'open' | 'close',
  pointerType?: PointerEvent['pointerType']
) {
  if (pointerType && pointerType !== 'mouse') {
    return 0;
  }

  if (typeof value === 'number') {
    return value;
  }

  return value?.[prop];
}

export interface Props {
  enabled?: boolean;
  handleClose?:
    | null
    | ((
        context: FloatingContext & {
          onClose: () => void;
          tree?: FloatingTreeType | null;
        }
      ) => (event: PointerEvent) => void);
  restMs?: number;
  delay?: number | Partial<{open: number; close: number}>;
  mouseOnly?: boolean;
}

/**
 * Adds hover event listeners that change the open state, like CSS :hover.
 * @see https://floating-ui.com/docs/useHover
 */
export const useHover = (
  context: FloatingContext,
  {
    enabled = true,
    delay = 0,
    handleClose = null,
    mouseOnly = false,
    restMs = 0,
  }: Props = {}
): ElementProps => {
  const {open, onOpenChange, dataRef, events, refs} = context;

  const tree = useFloatingTree();
  const onOpenChangeRef = useLatestRef(onOpenChange);
  const handleCloseRef = useLatestRef(handleClose);

  const pointerTypeRef = useRef<string>();
  const timeoutRef = useRef<any>();
  const handlerRef = useRef<(event: PointerEvent) => void>();
  const restTimeoutRef = useRef<any>();
  const blockMouseMoveRef = useRef(true);

  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }

    if (!open) {
      pointerTypeRef.current = undefined;
    }
  });

  useEffect(() => {
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
  }, [enabled, events, refs.floating]);

  useEffect(() => {
    if (!enabled || !handleCloseRef.current) {
      return;
    }

    function onLeave() {
      if (dataRef.current.openEvent?.type.includes('mouse')) {
        onOpenChangeRef.current(false);
      }
    }

    const html = getDocument(refs.floating.current).documentElement;
    html.addEventListener('mouseleave', onLeave);
    return () => {
      html.removeEventListener('mouseleave', onLeave);
    };
  }, [refs.floating, onOpenChangeRef, enabled, handleCloseRef, dataRef]);

  const closeWithDelay = useCallback(
    (runElseBranch = true) => {
      if (delay && !handlerRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(
          () => onOpenChangeRef.current(false),
          getDelay(delay, 'close', pointerTypeRef.current)
        );
      } else if (runElseBranch) {
        onOpenChangeRef.current(false);
      }
    },
    [delay, onOpenChangeRef]
  );

  const cleanupPointerMoveHandler = useCallback(() => {
    if (handlerRef.current) {
      getDocument(refs.floating.current).removeEventListener(
        'pointermove',
        handlerRef.current
      );
      handlerRef.current = undefined;
    }
  }, [refs.floating]);

  useEffect(() => {
    if (!open) {
      cleanupPointerMoveHandler();
    }
  }, [open, enabled, cleanupPointerMoveHandler]);

  // Registering the mouse events on the reference directly to bypass React's
  // delegation system. If the cursor was on a disabled element and then entered
  // the reference (no gap), `mouseenter` doesn't fire in the delegation system.
  useEffect(() => {
    if (!enabled) {
      return;
    }

    function onMouseEnter(event: MouseEvent) {
      clearTimeout(timeoutRef.current);
      blockMouseMoveRef.current = false;

      if (
        open ||
        (mouseOnly && pointerTypeRef.current !== 'mouse') ||
        (restMs > 0 && getDelay(delay, 'open') === 0)
      ) {
        return;
      }

      dataRef.current.openEvent = event;

      if (delay) {
        timeoutRef.current = setTimeout(() => {
          onOpenChangeRef.current(true);
        }, getDelay(delay, 'open', pointerTypeRef.current));
      } else {
        onOpenChangeRef.current(true);
      }
    }

    function onMouseLeave(event: MouseEvent) {
      if (
        dataRef.current.openEvent?.type === 'click' ||
        dataRef.current.openEvent?.type === 'pointerdown'
      ) {
        return;
      }

      const doc = getDocument(refs.floating.current);
      clearTimeout(restTimeoutRef.current);

      if (handleCloseRef.current) {
        clearTimeout(timeoutRef.current);

        handlerRef.current &&
          doc.removeEventListener('pointermove', handlerRef.current);

        handlerRef.current = handleCloseRef.current({
          ...context,
          tree,
          x: event.clientX,
          y: event.clientY,
          onClose() {
            cleanupPointerMoveHandler();
            closeWithDelay();
          },
        });

        doc.addEventListener('pointermove', handlerRef.current);
        return;
      }

      closeWithDelay();
    }

    const reference = refs.reference.current;

    if (isElement(reference)) {
      reference.addEventListener('mouseenter', onMouseEnter);
      reference.addEventListener('mouseleave', onMouseLeave);
      return () => {
        reference.removeEventListener('mouseenter', onMouseEnter);
        reference.removeEventListener('mouseleave', onMouseLeave);
      };
    }
  }, [
    enabled,
    closeWithDelay,
    context,
    delay,
    handleCloseRef,
    dataRef,
    mouseOnly,
    onOpenChangeRef,
    open,
    tree,
    restMs,
    cleanupPointerMoveHandler,
    refs.reference,
    refs.floating,
  ]);

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
      onMouseLeave: () => closeWithDelay(false),
    },
  };
};
