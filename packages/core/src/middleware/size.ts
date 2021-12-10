import {
  Dimensions,
  ElementRects,
  Middleware,
  MiddlewareArguments,
} from '../types';
import {
  detectOverflow,
  Options as DetectOverflowOptions,
} from '../detectOverflow';
import {getBasePlacement} from '../utils/getBasePlacement';
import {getAlignment} from '../utils/getAlignment';

export type Options = {
  apply(args: Dimensions & ElementRects): void;
};

export const size = (
  options: Partial<Options & DetectOverflowOptions> = {}
): Middleware => ({
  name: 'size',
  async fn(middlewareArguments: MiddlewareArguments) {
    const {placement, rects, middlewareData} = middlewareArguments;
    const {apply, ...detectOverflowOptions} = options;

    const overflow = await detectOverflow(
      middlewareArguments,
      detectOverflowOptions
    );
    const basePlacement = getBasePlacement(placement);
    const isEnd = getAlignment(placement) === 'end';

    let heightSide: 'top' | 'bottom';
    let widthSide: 'left' | 'right';

    if (basePlacement === 'top' || basePlacement === 'bottom') {
      heightSide = basePlacement;
      widthSide = isEnd ? 'left' : 'right';
    } else {
      widthSide = basePlacement;
      heightSide = isEnd ? 'top' : 'bottom';
    }

    const dimensions = {
      height: rects.floating.height - overflow[heightSide],
      width: rects.floating.width - overflow[widthSide],
    };

    if (middlewareData.size?.skip) {
      return {};
    }

    apply?.({...dimensions, ...rects});

    return {
      data: {
        skip: true,
      },
      reset: true,
    };
  },
});
