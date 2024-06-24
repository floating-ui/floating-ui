import type {ClientRectObject, Padding} from '@floating-ui/utils';
import {
  evaluate,
  getPaddingObject,
  getSide,
  getSideAxis,
  max,
  min,
  rectToClientRect,
} from '@floating-ui/utils';

import type {Derivable, Middleware} from '../types';

function getBoundingRect(rects: Array<ClientRectObject>) {
  const minX = min(...rects.map((rect) => rect.left));
  const minY = min(...rects.map((rect) => rect.top));
  const maxX = max(...rects.map((rect) => rect.right));
  const maxY = max(...rects.map((rect) => rect.bottom));
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

export function getRectsByLine(rects: Array<ClientRectObject>) {
  const sortedRects = rects.slice().sort((a, b) => a.y - b.y);
  const groups = [];
  let prevRect: ClientRectObject | null = null;
  for (let i = 0; i < sortedRects.length; i++) {
    const rect = sortedRects[i];
    if (!prevRect || rect.y - prevRect.y > prevRect.height / 2) {
      groups.push([rect]);
    } else {
      groups[groups.length - 1].push(rect);
    }
    prevRect = rect;
  }
  return groups.map((rect) => rectToClientRect(getBoundingRect(rect)));
}

export interface InlineOptions {
  /**
   * Viewport-relative `x` coordinate to choose a `ClientRect`.
   * @default undefined
   */
  x?: number;
  /**
   * Viewport-relative `y` coordinate to choose a `ClientRect`.
   * @default undefined
   */
  y?: number;
  /**
   * Represents the padding around a disjoined rect when choosing it.
   * @default 2
   */
  padding?: Padding;
}

/**
 * Provides improved positioning for inline reference elements that can span
 * over multiple lines, such as hyperlinks or range selections.
 * @see https://floating-ui.com/docs/inline
 */
export const inline = (
  options: InlineOptions | Derivable<InlineOptions> = {},
): Middleware => ({
  name: 'inline',
  options,
  async fn(state) {
    const {placement, elements, rects, platform, strategy} = state;
    // A MouseEvent's client{X,Y} coords can be up to 2 pixels off a
    // ClientRect's bounds, despite the event listener being triggered. A
    // padding of 2 seems to handle this issue.
    const {padding = 2, x, y} = evaluate(options, state);

    const nativeClientRects = Array.from(
      (await platform.getClientRects?.(elements.reference)) || [],
    );

    const clientRects = getRectsByLine(nativeClientRects);
    const fallback = rectToClientRect(getBoundingRect(nativeClientRects));
    const paddingObject = getPaddingObject(padding);

    function getBoundingClientRect() {
      // There are two rects and they are disjoined.
      if (
        clientRects.length === 2 &&
        clientRects[0].left > clientRects[1].right &&
        x != null &&
        y != null
      ) {
        // Find the first rect in which the point is fully inside.
        return (
          clientRects.find(
            (rect) =>
              x > rect.left - paddingObject.left &&
              x < rect.right + paddingObject.right &&
              y > rect.top - paddingObject.top &&
              y < rect.bottom + paddingObject.bottom,
          ) || fallback
        );
      }

      // There are 2 or more connected rects.
      if (clientRects.length >= 2) {
        if (getSideAxis(placement) === 'y') {
          const firstRect = clientRects[0];
          const lastRect = clientRects[clientRects.length - 1];
          const isTop = getSide(placement) === 'top';

          const top = firstRect.top;
          const bottom = lastRect.bottom;
          const left = isTop ? firstRect.left : lastRect.left;
          const right = isTop ? firstRect.right : lastRect.right;
          const width = right - left;
          const height = bottom - top;

          return {
            top,
            bottom,
            left,
            right,
            width,
            height,
            x: left,
            y: top,
          };
        }

        const isLeftSide = getSide(placement) === 'left';
        const maxRight = max(...clientRects.map((rect) => rect.right));
        const minLeft = min(...clientRects.map((rect) => rect.left));
        const measureRects = clientRects.filter((rect) =>
          isLeftSide ? rect.left === minLeft : rect.right === maxRight,
        );

        const top = measureRects[0].top;
        const bottom = measureRects[measureRects.length - 1].bottom;
        const left = minLeft;
        const right = maxRight;
        const width = right - left;
        const height = bottom - top;

        return {
          top,
          bottom,
          left,
          right,
          width,
          height,
          x: left,
          y: top,
        };
      }

      return fallback;
    }

    const resetRects = await platform.getElementRects({
      reference: {getBoundingClientRect},
      floating: elements.floating,
      strategy,
    });

    if (
      rects.reference.x !== resetRects.reference.x ||
      rects.reference.y !== resetRects.reference.y ||
      rects.reference.width !== resetRects.reference.width ||
      rects.reference.height !== resetRects.reference.height
    ) {
      return {
        reset: {
          rects: resetRects,
        },
      };
    }

    return {};
  },
});
