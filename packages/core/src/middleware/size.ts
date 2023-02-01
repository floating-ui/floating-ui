import {
  detectOverflow,
  Options as DetectOverflowOptions,
} from '../detectOverflow';
import type {ElementRects, Middleware, MiddlewareArguments, SideObject} from '../types';
import {getAlignment} from '../utils/getAlignment';
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

    //compute available dimensions:

    const dimensions = {
      availableHeight: ['left', 'right'].includes(placement)
      ? -Math.min(overflow.top, overflow.bottom) - Math.max(overflow.top, overflow.bottom)
      : -overflow[heightSide],

      availableWidth: ['top', 'bottom'].includes(placement)
      ? -Math.min(overflow.left, overflow.right) - Math.max(overflow.left, overflow.right)
      : -overflow[widthSide]
    };

    if (dimensions.availableHeight >= 0) dimensions.availableHeight += rects.floating.height;
    else dimensions.availableHeight = 0;

    if (dimensions.availableWidth >= 0) dimensions.availableWidth += rects.floating.width;
    else dimensions.availableWidth = 0;

    //call apply using the dimensions and reset if necessary:

    await apply({...middlewareArguments, ...dimensions});

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