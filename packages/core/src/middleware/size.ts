import {
  detectOverflow,
  Options as DetectOverflowOptions,
} from '../detectOverflow';
import type {Middleware, MiddlewareArguments} from '../types';
import {getAlignment} from '../utils/getAlignment';
import {getMainAxisFromPlacement} from '../utils/getMainAxisFromPlacement';
import {getSide} from '../utils/getSide';
import {max} from '../utils/math';

export interface Options {
  /**
   * Function that is called to perform style mutations to the floating element
   * to change its size.
   * @default undefined
   */
  apply(
    args: MiddlewareArguments & {
      availableWidth: number;
      availableHeight: number;
    }
  ): void | Promise<void>;
}

/**
 * Provides data to change the size of the floating element. For instance,
 * prevent it from overflowing its clipping boundary or match the width of the
 * reference element.
 * @see https://floating-ui.com/docs/size
 */
export const size = (
  options: Partial<Options & DetectOverflowOptions> = {}
): Middleware => ({
  name: 'size',
  options,
  async fn(middlewareArguments) {
    const {placement, rects, platform, elements} = middlewareArguments;
    const {apply = () => {}, ...detectOverflowOptions} = options;

    const overflow = await detectOverflow(
      middlewareArguments,
      detectOverflowOptions
    );
    const side = getSide(placement);
    const alignment = getAlignment(placement);
    const axis = getMainAxisFromPlacement(placement);

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

    const xMin = max(overflow.left, 0);
    const xMax = max(overflow.right, 0);
    const yMin = max(overflow.top, 0);
    const yMax = max(overflow.bottom, 0);

    let availableHeight = rects.floating.height - overflow[heightSide];
    let availableWidth = rects.floating.width - overflow[widthSide];

    if (!middlewareArguments.middlewareData.shift && !alignment) {
      if (axis === 'x') {
        availableWidth =
          rects.floating.width -
          2 *
            (xMin !== 0 || xMax !== 0
              ? xMin + xMax
              : max(overflow.left, overflow.right));
      } else {
        availableHeight =
          rects.floating.height -
          2 *
            (yMin !== 0 || yMax !== 0
              ? yMin + yMax
              : max(overflow.top, overflow.bottom));
      }
    }

    await apply({...middlewareArguments, availableWidth, availableHeight});

    const nextDimensions = await platform.getDimensions(elements.floating);

    if (
      rects.floating.width !== nextDimensions.width ||
      rects.floating.height !== nextDimensions.height
    ) {
      return {
        reset: {
          rects: true,
        },
      };
    }

    return {};
  },
});
