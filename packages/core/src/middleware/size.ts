import {
  evaluate,
  getAlignment,
  getSide,
  getSideAxis,
  max,
  min,
} from '@floating-ui/utils';

import type {DetectOverflowOptions} from '../detectOverflow';
import type {Derivable, Middleware, MiddlewareState} from '../types';

// Method syntax keeps callback parameters bivariant, but expressing the
// explicit `| undefined` required by `exactOptionalPropertyTypes` needs
// property syntax, which is contravariant under `strictFunctionTypes`.
// Extracting the function from a method position restores that bivariance so
// consumers can still assign callbacks with narrower parameter types.
type BivariantCallback<T extends (...args: any[]) => any> = {
  bivariance(...args: Parameters<T>): ReturnType<T>;
}['bivariance'];

export interface SizeOptions extends DetectOverflowOptions {
  /**
   * Function that is called to perform style mutations to the floating element
   * to change its size.
   * @default undefined
   */
  apply?:
    | BivariantCallback<
        (
          args: MiddlewareState & {
            availableWidth: number;
            availableHeight: number;
          },
        ) => void | Promise<void>
      >
    | undefined;
}

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
export const size = (
  options: SizeOptions | Derivable<SizeOptions> = {},
): Middleware => ({
  name: 'size',
  options,
  async fn(state) {
    const {placement, rects, platform, elements} = state;

    const {apply = () => {}, ...detectOverflowOptions} = evaluate(
      options,
      state,
    );

    const overflow = await platform.detectOverflow(
      state,
      detectOverflowOptions,
    );
    const side = getSide(placement);
    const alignment = getAlignment(placement);
    const isYAxis = getSideAxis(placement) === 'y';
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

    const maximumClippingHeight = height - overflow.top - overflow.bottom;
    const maximumClippingWidth = width - overflow.left - overflow.right;

    const overflowAvailableHeight = min(
      height - overflow[heightSide],
      maximumClippingHeight,
    );
    const overflowAvailableWidth = min(
      width - overflow[widthSide],
      maximumClippingWidth,
    );

    const shiftData = state.middlewareData.shift;
    const noShift = !shiftData;

    let availableHeight = overflowAvailableHeight;
    let availableWidth = overflowAvailableWidth;

    if (shiftData?.enabled.x) {
      availableWidth = maximumClippingWidth;
    }
    if (shiftData?.enabled.y) {
      availableHeight = maximumClippingHeight;
    }

    if (noShift && !alignment) {
      if (isYAxis) {
        availableWidth = width - 2 * max(overflow.left, overflow.right);
      } else {
        availableHeight = height - 2 * max(overflow.top, overflow.bottom);
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
