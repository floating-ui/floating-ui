import {clamp, floor} from '@floating-ui/utils';
import {
  getDocumentElement,
  getOverflowAncestors,
  getWindow,
} from '@floating-ui/utils/dom';

import type {ClientRectObject} from '@floating-ui/core';

import type {FloatingElement, ReferenceElement} from './types';
import {getBoundingClientRect} from './utils/getBoundingClientRect';
import {unwrapElement} from './utils/unwrapElement';
import {rectsAreEqual} from './utils/rectsAreEqual';

export interface AutoUpdateOptions {
  /**
   * Whether to update the position when an overflow ancestor is scrolled.
   * @default true
   */
  ancestorScroll?: boolean | undefined;
  /**
   * Whether to update the position when an overflow ancestor is resized. This
   * uses the native `resize` event.
   * @default true
   */
  ancestorResize?: boolean | undefined;
  /**
   * Whether to update the position when either the reference or floating
   * elements resized. This uses a `ResizeObserver`.
   * @default true
   */
  elementResize?: boolean | undefined;
  /**
   * Whether to update the position when the reference relocated on the screen
   * due to layout shift.
   * @default true
   */
  layoutShift?: boolean | undefined;
  /**
   * Whether to update on every animation frame if necessary. Only use if you
   * need to update the position in response to an animation using transforms.
   * @default false
   */
  animationFrame?: boolean | undefined;
}

// https://samthor.au/2021/observing-dom/
function observeMove(
  element: Element,
  onMove: () => void,
  ancestorResize: boolean,
) {
  let io: IntersectionObserver | null = null;
  let timeoutId: NodeJS.Timeout;

  const root = getDocumentElement(element);

  function cleanup() {
    clearTimeout(timeoutId);
    io?.disconnect();
    io = null;
  }

  function refresh(skip = false, threshold = 1) {
    cleanup();

    const elementRectForRootMargin = element.getBoundingClientRect();
    const {left, top, width, height} = elementRectForRootMargin;

    if (!skip) {
      onMove();
    }

    if (!width || !height) {
      return;
    }

    const insetTop = floor(top);
    const insetRight = floor(root.clientWidth - (left + width));
    const insetBottom = floor(root.clientHeight - (top + height));
    const insetLeft = floor(left);
    const rootMargin = `${-insetTop}px ${-insetRight}px ${-insetBottom}px ${-insetLeft}px`;

    const options = {
      rootMargin,
      threshold: clamp(0, threshold, 1) || 1,
    };

    let isFirstUpdate = true;

    function handleObserve(entries: IntersectionObserverEntry[]) {
      const ratio = entries[0].intersectionRatio;

      // The entry is a snapshot, so the reference may have moved since the
      // intersection was computed (under performance constraints, or between
      // consecutive frames of a multi-frame layout shift). The reported ratio
      // and the observed area are stale in that case and cannot be trusted to
      // detect subsequent movement, so refresh regardless of the ratio.
      if (
        !rectsAreEqual(
          elementRectForRootMargin,
          element.getBoundingClientRect(),
        )
      ) {
        return refresh();
      }

      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }

        if (!ratio) {
          // If the reference is clipped in place, the ratio is 0. Throttle
          // the refresh to prevent an infinite loop of updates.
          timeoutId = setTimeout(() => {
            refresh(false, 1e-7);
          }, 1000);
        } else {
          refresh(false, ratio);
        }
      }

      isFirstUpdate = false;
    }

    // Older browsers don't support a `document` as the root and will throw an
    // error.
    try {
      io = new IntersectionObserver(handleObserve, {
        ...options,
        // Handle <iframe>s
        root: root.ownerDocument,
      });
    } catch (_e) {
      io = new IntersectionObserver(handleObserve, options);
    }

    io.observe(element);
  }

  const win = getWindow(element);
  // The window is a resize ancestor, so when `ancestorResize` is enabled its
  // listener already runs the update on resize. Here we only need to rebuild
  // the `IntersectionObserver` for the new root size, skipping a redundant
  // update. When `ancestorResize` is disabled, this becomes the sole update.
  const handleResize = () => refresh(ancestorResize);

  win.addEventListener('resize', handleResize);

  refresh(true);

  return () => {
    win.removeEventListener('resize', handleResize);
    cleanup();
  };
}

/**
 * Automatically updates the position of the floating element when necessary.
 * Should only be called when the floating element is mounted on the DOM or
 * visible on the screen.
 * @returns cleanup function that should be invoked when the floating element is
 * removed from the DOM or hidden from the screen.
 * @see https://floating-ui.com/docs/autoUpdate
 */
export function autoUpdate(
  reference: ReferenceElement,
  floating: FloatingElement | null,
  update: () => void,
  options: AutoUpdateOptions = {},
) {
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === 'function',
    layoutShift = typeof IntersectionObserver === 'function',
    animationFrame = false,
  } = options;

  const referenceEl = unwrapElement(reference);

  const ancestors =
    ancestorScroll || ancestorResize
      ? [
          ...(referenceEl ? getOverflowAncestors(referenceEl) : []),
          ...(floating ? getOverflowAncestors(floating) : []),
        ]
      : [];

  ancestors.forEach((ancestor) => {
    ancestorScroll && ancestor.addEventListener('scroll', update);
    ancestorResize && ancestor.addEventListener('resize', update);
  });

  const cleanupIo =
    referenceEl && layoutShift
      ? observeMove(referenceEl, update, ancestorResize)
      : null;

  let reobserveFrame = -1;
  let resizeObserver: ResizeObserver | null = null;
  let floatingWidth = -1;
  let floatingHeight = -1;
  let reobserveAfterReferenceResize = false;

  if (elementResize) {
    resizeObserver = new ResizeObserver((entries) => {
      let changed = false;
      let referenceResized = false;

      entries.forEach(({target, contentRect}) => {
        if (target !== floating) {
          changed = true;
          referenceResized = true;
          return;
        }

        // Keep one extra pass after the reference resizes (including the
        // initial observation): styles applied after positioning, such as
        // placement-dependent padding or transitions, can depend on it.
        if (reobserveAfterReferenceResize) {
          reobserveAfterReferenceResize = false;
          changed = true;
        }

        // Observing the floating element again delivers its current size,
        // which only needs an update if it changed in the meantime. Read it
        // only for this entry: test mocks often omit `contentRect` on others.
        const {width, height} = contentRect;
        if (width !== floatingWidth || height !== floatingHeight) {
          changed = true;
        }

        floatingWidth = width;
        floatingHeight = height;
      });

      if (!changed) {
        return;
      }

      if (resizeObserver && floating) {
        // The update can resize the floating element (e.g. via the `size`
        // middleware). A resize inside the delivery that caused it is reported
        // as a "ResizeObserver loop", so stop observing it until the next frame.
        // https://github.com/floating-ui/floating-ui/issues/1740
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        reobserveFrame = requestAnimationFrame(() => {
          resizeObserver?.observe(floating);
        });
        reobserveAfterReferenceResize = referenceResized;
      }

      update();
    });

    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }

    if (floating) {
      resizeObserver.observe(floating);
    }
  }

  let frameId: number;
  let prevRefRect: ClientRectObject | null = null;

  if (animationFrame) {
    frameLoop();
  }

  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);

    if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) {
      update();
    }

    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }

  update();

  return () => {
    ancestors.forEach((ancestor) => {
      ancestorScroll && ancestor.removeEventListener('scroll', update);
      ancestorResize && ancestor.removeEventListener('resize', update);
    });

    cleanupIo?.();
    resizeObserver?.disconnect();
    resizeObserver = null;

    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}
