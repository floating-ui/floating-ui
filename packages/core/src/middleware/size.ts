import {
  detectOverflow,
  Options as DetectOverflowOptions,
} from '../detectOverflow';
import type {Middleware, MiddlewareState} from '../types';
import {getAlignment} from '../utils/getAlignment';
import {getMainAxisFromPlacement} from '../utils/getMainAxisFromPlacement';
import {getSide} from '../utils/getSide';
import {max, min} from '../utils/math';

export interface Options {
  /**
   * Function that is called to perform style mutations to the floating element
   * to change its size.
   * @default undefined
   */
  apply(
    args: MiddlewareState & {
      availableWidth: number;
      availableHeight: number;
    }
  ): void | Promise<void>;
}

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
export const size = (
  options: Partial<Options & DetectOverflowOptions> = {}
): Middleware => ({
  name: 'size',
  options,
  async fn(state) {
    const {placement, rects, platform, elements} = state;
    const {apply = () => {}, ...detectOverflowOptions} = options;

    const overflow = await detectOverflow(state, detectOverflowOptions);
    const side = getSide(placement);
    const alignment = getAlignment(placement);
    const axis = getMainAxisFromPlacement(placement);
    const isXAxis = axis === 'x';
    const {width, height} = rects.floating;

    let heightSide: 'top' | 'bottom';
    let widthSide: 'left' | 'right';

    if (side === 'top' || side === 'bottom') {
      heightSide = side;
      widthSide =
        alignment ===
        ((await platform.isRTL?.(elements.floating)) ? 'start' : 'end')
          ? 'left'
          : 'right';
    } else {
      widthSide = side;
      heightSide = alignment === 'end' ? 'top' : 'bottom';
    }

    const overflowAvailableHeight = height - overflow[heightSide];
    const overflowAvailableWidth = width - overflow[widthSide];

    let availableHeight = overflowAvailableHeight;
    let availableWidth = overflowAvailableWidth;

    if (isXAxis) {
      availableWidth = min(
        // Maximum clipping viewport width
        width - overflow.right - overflow.left,
        overflowAvailableWidth
      );
    } else {
      availableHeight = min(
        // Maximum clipping viewport height
        height - overflow.bottom - overflow.top,
        overflowAvailableHeight
      );
    }

    if (!state.middlewareData.shift && !alignment) {
      const xMin = max(overflow.left, 0);
      const xMax = max(overflow.right, 0);
      const yMin = max(overflow.top, 0);
      const yMax = max(overflow.bottom, 0);

      if (isXAxis) {
        availableWidth =
          width -
          2 *
            (xMin !== 0 || xMax !== 0
              ? xMin + xMax
              : max(overflow.left, overflow.right));
      } else {
        availableHeight =
          height -
          2 *
            (yMin !== 0 || yMax !== 0
              ? yMin + yMax
              : max(overflow.top, overflow.bottom));
      }
    }

    await apply({...state, availableWidth, availableHeight});

    const nextDimensions = await platform.getDimensions(elements.floating);

    if (width !== nextDimensions.width || height !== nextDimensions.height) {
      return {
        reset: {
          rects: true,
        },
      };
    }

    return {};
  },
});
