import * as React from 'react';
import {getWindow} from '@floating-ui/utils/dom';
import {
  contains,
  getTarget,
  isMouseLikePointerType,
  useModernLayoutEffect,
  useEffectEvent,
} from '@floating-ui/react/utils';

import type {ContextData, ElementProps, FloatingRootContext} from '../types';

function createVirtualElement(
  domElement: Element | null | undefined,
  data: {
    axis: 'x' | 'y' | 'both';
    dataRef: React.MutableRefObject<ContextData>;
    pointerType: string | undefined;
    x: number | null;
    y: number | null;
  },
) {
  let offsetX: number | null = null;
  let offsetY: number | null = null;
  let isAutoUpdateEvent = false;

  return {
    contextElement: domElement || undefined,
    getBoundingClientRect() {
      const domRect = domElement?.getBoundingClientRect() || {
        width: 0,
        height: 0,
        x: 0,
        y: 0,
      };

      const isXAxis = data.axis === 'x' || data.axis === 'both';
      const isYAxis = data.axis === 'y' || data.axis === 'both';
      const canTrackCursorOnAutoUpdate =
        ['mouseenter', 'mousemove'].includes(
          data.dataRef.current.openEvent?.type || '',
        ) && data.pointerType !== 'touch';

      let width = domRect.width;
      let height = domRect.height;
      let x = domRect.x;
      let y = domRect.y;

      if (offsetX == null && data.x && isXAxis) {
        offsetX = domRect.x - data.x;
      }

      if (offsetY == null && data.y && isYAxis) {
        offsetY = domRect.y - data.y;
      }

      x -= offsetX || 0;
      y -= offsetY || 0;
      width = 0;
      height = 0;

      if (!isAutoUpdateEvent || canTrackCursorOnAutoUpdate) {
        width = data.axis === 'y' ? domRect.width : 0;
        height = data.axis === 'x' ? domRect.height : 0;
        x = isXAxis && data.x != null ? data.x : x;
        y = isYAxis && data.y != null ? data.y : y;
      } else if (isAutoUpdateEvent && !canTrackCursorOnAutoUpdate) {
        height = data.axis === 'x' ? domRect.height : height;
        width = data.axis === 'y' ? domRect.width : width;
      }

      isAutoUpdateEvent = true;

      return {
        width,
        height,
        x,
        y,
        top: y,
        right: x + width,
        bottom: y + height,
        left: x,
      };
    },
  };
}

function isMouseBasedEvent(event: Event | undefined): event is MouseEvent {
  return event != null && (event as MouseEvent).clientX != null;
}

export interface UseClientPointProps {
  /**
   * Whether the Hook is enabled, including all internal Effects and event
   * handlers.
   * @default true
   */
  enabled?: boolean;
  /**
   * Whether to restrict the client point to an axis and use the reference
   * element (if it exists) as the other axis. This can be useful if the
   * floating element is also interactive.
   * @default 'both'
   */
  axis?: 'x' | 'y' | 'both';
  /**
   * An explicitly defined `x` client coordinate.
   * @default null
   */
  x?: number | null;
  /**
   * An explicitly defined `y` client coordinate.
   * @default null
   */
  y?: number | null;
}

/**
 * Positions the floating element relative to a client point (in the viewport),
 * such as the mouse position. By default, it follows the mouse cursor.
 * @see https://floating-ui.com/docs/useClientPoint
 */
export function useClientPoint(
  context: FloatingRootContext,
  props: UseClientPointProps = {},
): ElementProps {
  const {
    open,
    dataRef,
    elements: {floating, domReference},
    refs,
  } = context;
  const {enabled = true, axis = 'both', x = null, y = null} = props;

  const initialRef = React.useRef(false);
  const cleanupListenerRef = React.useRef<null | (() => void)>(null);

  const [pointerType, setPointerType] = React.useState<string | undefined>();
  const [reactive, setReactive] = React.useState([]);

  const setReference = useEffectEvent((x: number | null, y: number | null) => {
    if (initialRef.current) return;

    // Prevent setting if the open event was not a mouse-like one
    // (e.g. focus to open, then hover over the reference element).
    // Only apply if the event exists.
    if (
      dataRef.current.openEvent &&
      !isMouseBasedEvent(dataRef.current.openEvent)
    ) {
      return;
    }

    refs.setPositionReference(
      createVirtualElement(domReference, {
        x,
        y,
        axis,
        dataRef,
        pointerType,
      }),
    );
  });

  const handleReferenceEnterOrMove = useEffectEvent(
    (event: React.MouseEvent<Element>) => {
      if (x != null || y != null) return;

      if (!open) {
        setReference(event.clientX, event.clientY);
      } else if (!cleanupListenerRef.current) {
        // If there's no cleanup, there's no listener, but we want to ensure
        // we add the listener if the cursor landed on the floating element and
        // then back on the reference (i.e. it's interactive).
        setReactive([]);
      }
    },
  );

  // If the pointer is a mouse-like pointer, we want to continue following the
  // mouse even if the floating element is transitioning out. On touch
  // devices, this is undesirable because the floating element will move to
  // the dismissal touch point.
  const openCheck = isMouseLikePointerType(pointerType) ? floating : open;

  const addListener = React.useCallback(() => {
    // Explicitly specified `x`/`y` coordinates shouldn't add a listener.
    if (!openCheck || !enabled || x != null || y != null) return;

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

    refs.setPositionReference(domReference);
  }, [
    openCheck,
    enabled,
    x,
    y,
    floating,
    dataRef,
    refs,
    domReference,
    setReference,
  ]);

  React.useEffect(() => {
    return addListener();
  }, [addListener, reactive]);

  React.useEffect(() => {
    if (enabled && !floating) {
      initialRef.current = false;
    }
  }, [enabled, floating]);

  React.useEffect(() => {
    if (!enabled && open) {
      initialRef.current = true;
    }
  }, [enabled, open]);

  useModernLayoutEffect(() => {
    if (enabled && (x != null || y != null)) {
      initialRef.current = false;
      setReference(x, y);
    }
  }, [enabled, x, y, setReference]);

  const reference: ElementProps['reference'] = React.useMemo(() => {
    function setPointerTypeRef({pointerType}: React.PointerEvent) {
      setPointerType(pointerType);
    }

    return {
      onPointerDown: setPointerTypeRef,
      onPointerEnter: setPointerTypeRef,
      onMouseMove: handleReferenceEnterOrMove,
      onMouseEnter: handleReferenceEnterOrMove,
    };
  }, [handleReferenceEnterOrMove]);

  return React.useMemo(
    () => (enabled ? {reference} : {}),
    [enabled, reference],
  );
}
