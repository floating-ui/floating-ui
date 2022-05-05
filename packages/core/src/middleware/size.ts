import type {Middleware, MiddlewareArguments} from '../types';
import {
  detectOverflow,
  Options as DetectOverflowOptions,
} from '../detectOverflow';
import {getSide} from '../utils/getSide';
import {getAlignment} from '../utils/getAlignment';
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
  ): void;
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
    const {apply, ...detectOverflowOptions} = options;

    const overflow = await detectOverflow(
      middlewareArguments,
      detectOverflowOptions
    );
    const side = getSide(placement);
    const alignment = getAlignment(placement);

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

    const dimensions = {
      availableHeight:
        rects.floating.height -
        (['left', 'right'].includes(placement)
          ? 2 *
            (yMin !== 0 || yMax !== 0
              ? yMin + yMax
              : max(overflow.top, overflow.bottom))
          : overflow[heightSide]),
      availableWidth:
        rects.floating.width -
        (['top', 'bottom'].includes(placement)
          ? 2 *
            (xMin !== 0 || xMax !== 0
              ? xMin + xMax
              : max(overflow.left, overflow.right))
          : overflow[widthSide]),
    };

    const prevDimensions = await platform.getDimensions(elements.floating);

    apply?.({
      ...middlewareArguments,
      ...dimensions,
    });

    const nextDimensions = await platform.getDimensions(elements.floating);

    if (
      prevDimensions.width !== nextDimensions.width ||
      prevDimensions.height !== nextDimensions.height
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
