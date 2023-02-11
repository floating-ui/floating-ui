import * as React from 'react';
import useLayoutEffect from 'use-isomorphic-layout-effect';

import type {
  Coords,
  Dimensions,
  ElementProps,
  FloatingContext,
  ReferenceType,
} from '../types';
import {contains} from '../utils/contains';
import {getTarget} from '../utils/getTarget';
import {getWindow, isMouseLikePointerType} from '../utils/is';
import {useEvent} from './utils/useEvent';
import {useLatestRef} from './utils/useLatestRef';

function createVirtualElement(rect: Coords & Partial<Dimensions>) {
  return {
    getBoundingClientRect() {
      const width = rect.width || 0;
      const height = rect.height || 0;
      return {
        width,
        height,
        x: rect.x,
        y: rect.y,
        top: rect.y,
        right: rect.x + width,
        bottom: rect.y + height,
        left: rect.x,
      };
    },
  };
}

function isMouseBasedEvent(event: Event | undefined): event is MouseEvent {
  return event != null && (event as MouseEvent).clientX != null;
}

export interface Props {
  enabled: boolean;
  axis: 'x' | 'y' | 'both';
  follow: boolean;
  x: number | null;
  y: number | null;
}

/**
 * Positions the floating element relative to a client point (in the viewport),
 * such as the mouse position. By default, it follows the mouse cursor.
 * @see https://floating-ui.com/docs/useClientPoint
 */
export const useClientPoint = <RT extends ReferenceType = ReferenceType>(
  {open, refs, dataRef, elements: {floating}}: FloatingContext<RT>,
  {enabled = true, axis = 'both', follow = true, x, y}: Partial<Props> = {}
): ElementProps => {
  const initialRef = React.useRef(false);
  const pointerTypeRef = React.useRef<string | undefined>();
  const initialOpenEventRef = React.useRef<Event | undefined>();
  const cleanupListenerRef = React.useRef<null | (() => void)>(null);

  const openRef = useLatestRef(open);

  const setReference = useEvent((x: number, y: number) => {
    if (initialRef.current) return;

    // Prevent setting if the open event was not a mouse-like one
    // (e.g. focus to open, then hover over the reference element).
    // Only apply if the event exists.
    if (
      initialOpenEventRef.current &&
      !isMouseBasedEvent(initialOpenEventRef.current)
    ) {
      return;
    }

    const domRect = refs.domReference.current?.getBoundingClientRect() || {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
    };

    const getVirtualElement = {
      both: () => createVirtualElement({x, y}),
      x: () =>
        createVirtualElement({
          x,
          y: domRect.top,
          width: 0,
          height: domRect.height,
        }),
      y: () =>
        createVirtualElement({
          x: domRect.left,
          y,
          width: domRect.width,
          height: 0,
        }),
    }[axis];

    if (getVirtualElement) {
      refs.setPositionReference(getVirtualElement());
    }
  });

  const addListener = useEvent(() => {
    // If the pointer is a mouse-like pointer, we want to continue following the
    // mouse even if the floating element is transitioning out. On touch
    // devices, this is undesirable because the floating element will move to
    // the dismissal touch point.
    const check = isMouseLikePointerType(pointerTypeRef.current)
      ? floating
      : openRef.current;

    // Explicitly specified `x`/`y` coordinates shouldn't add a listener.
    if (!check || !enabled || x != null || y != null) return;

    const win = getWindow(floating);

    function handleMouseMove(event: MouseEvent) {
      const target = getTarget(event) as Element | null;

      if (!contains(floating, target)) {
        setReference(event.clientX, event.clientY);
      } else {
        win.removeEventListener('mousemove', handleMouseMove);
        cleanupListenerRef.current = null;
      }
    }

    if (
      !dataRef.current.openEvent ||
      isMouseBasedEvent(dataRef.current.openEvent)
    ) {
      win.addEventListener('mousemove', handleMouseMove);
      const cleanup = () => {
        win.removeEventListener('mousemove', handleMouseMove);
        cleanupListenerRef.current = null;
      };
      cleanupListenerRef.current = cleanup;
      return cleanup;
    }

    refs.setPositionReference(refs.domReference.current);
  });

  const handleReferenceEnterOrMove = useEvent(
    (event: React.MouseEvent<Element>) => {
      if (x != null || y != null) return;

      if (!open) {
        setReference(event.clientX, event.clientY);
      } else if (!cleanupListenerRef.current) {
        // If there's no cleanup, there's no listener, but we want to ensure
        // we add the listener if the cursor landed on the floating element and
        // then back on the reference (i.e. it's interactive).
        addListener();
      }
    }
  );

  React.useEffect(
    () => {
      const cleanup = addListener();
      return () => {
        cleanup?.();
        // It's possible that this is different since the last render because of
        // the `setBeforeOpenReference` function.
        cleanupListenerRef.current?.();
      };
    },
    // This should be reactive with respect to all of these values as though
    // `React.useCallback` were being used, but we're using `useEvent` instead
    // to make sure it's not reactive with respect to the event handlers in the
    // interaction props, so we can avoid specifying `floating` in the deps
    // array.
    [enabled, floating, x, y, addListener]
  );

  React.useEffect(() => {
    if (enabled && !floating) {
      initialRef.current = false;
    }
  }, [enabled, floating]);

  React.useEffect(() => {
    if (enabled && open && !follow) {
      initialRef.current = true;
    }
  }, [enabled, open, follow]);

  useLayoutEffect(() => {
    if (enabled) {
      initialOpenEventRef.current = open
        ? dataRef.current.openEvent
        : undefined;
    }
  }, [enabled, open, dataRef]);

  useLayoutEffect(() => {
    if (enabled && x != null && y != null) {
      initialRef.current = false;
      setReference(x, y);
    }
  }, [enabled, x, y, setReference]);

  return React.useMemo(() => {
    if (!enabled) return {};

    function setPointerTypeRef({pointerType}: React.PointerEvent) {
      pointerTypeRef.current = pointerType;
    }

    return {
      reference: {
        onPointerDown: setPointerTypeRef,
        onPointerEnter: setPointerTypeRef,
        onMouseMove: handleReferenceEnterOrMove,
        onMouseEnter: handleReferenceEnterOrMove,
      },
    };
  }, [enabled, handleReferenceEnterOrMove]);
};
