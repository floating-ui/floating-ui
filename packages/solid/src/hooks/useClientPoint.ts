import {getWindow} from '@floating-ui/utils/dom';
import {
  contains,
  getTarget,
  isMouseLikePointerType,
} from '@floating-ui/utils/react';
import {
  Accessor,
  createEffect,
  createMemo,
  createRenderEffect,
  createSignal,
  mergeProps,
  onCleanup,
  onMount,
} from 'solid-js';

import type {
  ContextData,
  ElementProps,
  FloatingContext,
  ReferenceType,
} from '../types';

function createVirtualElement(
  domRef: Element | null,
  data: {
    axis: 'x' | 'y' | 'both';
    dataRef: ContextData;
    pointerType: string | undefined;
    x: number | null;
    y: number | null;
  }
) {
  let offsetX: number | null = null;
  let offsetY: number | null = null;
  let isAutoUpdateEvent = false;

  return {
    contextElement: domRef || undefined,
    getBoundingClientRect() {
      const domRect = domRef?.getBoundingClientRect() || {
        width: 0,
        height: 0,
        x: 0,
        y: 0,
      };

      const isXAxis = data.axis === 'x' || data.axis === 'both';
      const isYAxis = data.axis === 'y' || data.axis === 'both';
      const canTrackCursorOnAutoUpdate =
        ['mouseenter', 'mousemove'].includes(
          data.dataRef.openEvent?.type || ''
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
  enabled?: Accessor<boolean>;
  axis?: 'x' | 'y' | 'both';
  x?: number | null;
  y?: number | null;
}

/**
 * Positions the floating element relative to a client point (in the viewport),
 * such as the mouse position. By default, it follows the mouse cursor.
 * @see https://floating-ui.com/docs/useClientPoint
 */
export function useClientPoint<RT extends ReferenceType = ReferenceType>(
  context: FloatingContext<RT>,
  props: UseClientPointProps = {}
): ElementProps {
  const {refs, dataRef} = context;
  const mergedProps = mergeProps(
    {
      enabled: () => true,
      axis: 'both',
      x: null,
      y: null,
    } as Required<UseClientPointProps>,
    props
  );
  const {enabled} = mergedProps;

  let initialRef = false;
  let cleanupListenerRef: null | (() => void) = null;

  const [pointerType, setPointerType] = createSignal<string | undefined>();
  const [reactive, setReactive] = createSignal([]);

  const setReference = (x: number | null, y: number | null) => {
    if (initialRef) return;

    // Prevent setting if the open event was not a mouse-like one
    // (e.g. focus to open, then hover over the reference element).
    // Only apply if the event exists.
    if (dataRef.openEvent && !isMouseBasedEvent(dataRef.openEvent)) {
      return;
    }
    const node = createVirtualElement(refs.reference() as Element, {
      x,
      y,
      axis: mergedProps.axis,
      dataRef,
      pointerType: pointerType(),
    });
    context.refs.setReference(node as RT); //changed by MR
  };

  const handleReferenceEnterOrMove = (event: MouseEvent) => {
    if (mergedProps.x != null || mergedProps.y != null) return;

    if (!context.open()) {
      setReference(event.clientX, event.clientY);
    } else if (!cleanupListenerRef?.()) {
      // If there's no cleanup, there's no listener, but we want to ensure
      // we add the listener if the cursor landed on the floating element and
      // then back on the reference (i.e. it's interactive).
      setReactive([]);
    }
  };

  // If the pointer is a mouse-like pointer, we want to continue following the
  // mouse even if the floating element is transitioning out. On touch
  // devices, this is undesirable because the floating element will move to
  // the dismissal touch point.
  const openCheck = createMemo(() =>
    isMouseLikePointerType(pointerType()) ? refs.floating() : context.open()
  );

  const addListener = () => {
    const {x, y} = mergedProps;

    // Explicitly specified `x`/`y` coordinates shouldn't add a listener.
    if (!openCheck() || !enabled() || x != null || y != null) return;
    const win = getWindow(refs.floating());

    function handleMouseMove(event: MouseEvent) {
      const target = getTarget(event) as Element | null;

      if (!contains(refs.floating(), target)) {
        setReference(event.clientX, event.clientY);
      } else {
        win.removeEventListener('mousemove', handleMouseMove);
        cleanupListenerRef = null;
      }
    }

    if (
      !context.dataRef.openEvent ||
      isMouseBasedEvent(context.dataRef.openEvent)
    ) {
      win.addEventListener('mousemove', handleMouseMove);
      const cleanup = () => {
        win.removeEventListener('mousemove', handleMouseMove);
        cleanupListenerRef = null;
      };
      cleanupListenerRef = cleanup;
      onCleanup(cleanup);
    }

    refs.setReference(refs.reference());
  };

  createEffect(() => reactive() && addListener());

  createEffect(() => {
    if (enabled() && !refs.floating()) {
      initialRef = false;
    }
  });

  createEffect(() => {
    if (!enabled() && context.open()) {
      initialRef = true;
    } else {
      initialRef = false;
    }
  });

  createRenderEffect(() => {
    const {x, y} = mergedProps;
    if (enabled() && (x != null || y != null)) {
      initialRef = false;
      setReference(x, y);
    }
  });

  function setPointerTypeRef({pointerType}: PointerEvent) {
    setPointerType(pointerType);
  }

  return !mergedProps.enabled()
    ? {}
    : {
        reference: {
          onPointerDown: setPointerTypeRef,
          onPointerEnter: setPointerTypeRef,
          onMouseMove: handleReferenceEnterOrMove,
          onMouseEnter: handleReferenceEnterOrMove,
        },
      };
}
