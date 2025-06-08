import {evaluate, getAlignment, getSide, getSideAxis, max, min} from '../utils';
import type {DetectOverflowOptions} from '../detectOverflow';
import {detectOverflow} from '../detectOverflow';
import type {
  Derivable,
  Middleware,
  MiddlewareState,
  MiddlewareReturn,
} from '../types';

export interface SizeOptions extends DetectOverflowOptions {
  /**
   * Function that is called to perform style mutations to the floating element
   * to change its size.
   * @default undefined
   */
  apply?(
    args: MiddlewareState & {
      availableWidth: number;
      availableHeight: number;
    },
  ): void | Promise<void>;
}

export function* sizeGen(
  state: MiddlewareState,
  options: SizeOptions | Derivable<SizeOptions> = {},
): Generator<any, MiddlewareReturn, any> {
  const {placement, rects, platform, elements} = state;

  const {apply = () => {}, ...detectOverflowOptions} = evaluate(options, state);

  const overflow = yield* detectOverflow(state, detectOverflowOptions);
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const isYAxis = getSideAxis(placement) === 'y';
  const {width, height} = rects.floating;

  let heightSide: 'top' | 'bottom';
  let widthSide: 'left' | 'right';

  if (side === 'top' || side === 'bottom') {
    heightSide = side;
    const rtl = yield platform.isRTL?.(elements.floating);
    widthSide = alignment === (rtl ? 'start' : 'end') ? 'left' : 'right';
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

  const noShift = !state.middlewareData.shift;

  let availableHeight = overflowAvailableHeight;
  let availableWidth = overflowAvailableWidth;

  if (state.middlewareData.shift?.enabled.x) {
    availableWidth = maximumClippingWidth;
  }
  if (state.middlewareData.shift?.enabled.y) {
    availableHeight = maximumClippingHeight;
  }

  if (noShift && !alignment) {
    const xMin = max(overflow.left, 0);
    const xMax = max(overflow.right, 0);
    const yMin = max(overflow.top, 0);
    const yMax = max(overflow.bottom, 0);

    if (isYAxis) {
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

  yield apply({...state, availableWidth, availableHeight});

  const nextDimensions = yield platform.getDimensions(elements.floating);

  if (width !== nextDimensions.width || height !== nextDimensions.height) {
    return {
      reset: {
        rects: true,
      },
    };
  }

  return {};
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
  fn(state) {
    return sizeGen(state, options);
  },
});
