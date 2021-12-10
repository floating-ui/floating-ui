import type {Coords, Middleware, Padding} from '../types';
import {getBasePlacement} from '../utils/getBasePlacement';
import {getMainAxisFromPlacement} from '../utils/getMainAxisFromPlacement';
import {getSideObjectFromPadding} from '../utils/getPaddingObject';
import {max, min} from '../utils/math';
import {rectToClientRect} from '../utils/rectToClientRect';

export type Options = Coords & {
  padding: Padding;
};

export const inline = (options: Partial<Options> = {}): Middleware => ({
  name: 'inline',
  async fn(middlewareArguments) {
    const {placement, elements, rects, platform, strategy, middlewareData} =
      middlewareArguments;
    // A MouseEvent's client{X,Y} coords can be up to 2 pixels off a
    // ClientRect's bounds, despite the event listener being triggered. A
    // padding of 2 seems to handle this issue.
    const {padding = 2, x, y} = options;

    if (middlewareData.inline?.skip) {
      return {};
    }

    const fallback = rectToClientRect(
      await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
        rect: rects.reference,
        offsetParent: await platform.getOffsetParent({
          element: elements.floating,
        }),
        strategy,
      })
    );
    const clientRects = Array.from(
      await platform.getClientRects({element: elements.reference})
    );
    const paddingObject = getSideObjectFromPadding(padding);

    function getBoundingClientRect() {
      // There are two rects and they are disjoined
      if (
        clientRects.length === 2 &&
        clientRects[0].left > clientRects[1].right &&
        x != null &&
        y != null
      ) {
        // Find the first rect in which the point is fully inside
        return (
          clientRects.find(
            (rect) =>
              x > rect.left - paddingObject.left &&
              x < rect.right + paddingObject.right &&
              y > rect.top - paddingObject.top &&
              y < rect.bottom + paddingObject.bottom
          ) ?? fallback
        );
      }

      // There are 2 or more connected rects
      if (clientRects.length >= 2) {
        if (getMainAxisFromPlacement(placement) === 'x') {
          const firstRect = clientRects[0];
          const lastRect = clientRects[clientRects.length - 1];
          const isTop = getBasePlacement(placement) === 'top';

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
        } else {
          const maxRight = max(...clientRects.map((rect) => rect.right));
          const minLeft = min(...clientRects.map((rect) => rect.left));
          return (
            clientRects.find(
              getBasePlacement(placement) === 'left'
                ? (rect) => rect.left === minLeft
                : (rect) => rect.right === maxRight
            ) ?? fallback
          );
        }
      }

      return fallback;
    }

    return {
      data: {
        skip: true,
      },
      reset: {
        rects: await platform.getElementRects({
          reference: {getBoundingClientRect},
          floating: elements.floating,
          strategy,
        }),
      },
    };
  },
});
