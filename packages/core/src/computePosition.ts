import {computeCoordsFromPlacement} from './computeCoordsFromPlacement';
import {detectOverflow} from './detectOverflow';
import type {
  ComputePosition,
  Middleware,
  MiddlewareData,
  Platform,
} from './types';

// Maximum number of resets that can occur before bailing to avoid infinite reset loops.
const MAX_RESET_COUNT = 50;

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a given reference element.
 *
 * This export does not have any `platform` interface logic. You will need to
 * write one for the platform you are using Floating UI with.
 */
export const computePosition: ComputePosition = async (
  reference,
  floating,
  config,
) => {
  const {
    placement = 'bottom',
    strategy = 'absolute',
    middleware = [],
    platform,
  } = config;

  const platformWithDetectOverflow = (
    platform.detectOverflow ? platform : {...platform, detectOverflow}
  ) as Platform & {detectOverflow: typeof detectOverflow};
  const rtl = await platform.isRTL?.(floating);

  let rects = await platform.getElementRects({reference, floating, strategy});
  let {x, y} = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let resetCount = 0;

  const middlewareData: MiddlewareData = {};

  for (let i = 0; i < middleware.length; i++) {
    const currentMiddleware = middleware[i] as Middleware | undefined;

    if (!currentMiddleware) {
      continue;
    }

    const {name, fn} = currentMiddleware;

    const {
      x: nextX,
      y: nextY,
      data,
      reset,
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform: platformWithDetectOverflow,
      elements: {reference, floating},
    });

    x = nextX ?? x;
    y = nextY ?? y;

    middlewareData[name] = {
      ...middlewareData[name],
      ...data,
    };

    if (reset && resetCount < MAX_RESET_COUNT) {
      resetCount++;

      if (typeof reset === 'object') {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }

        if (reset.rects) {
          rects =
            reset.rects === true
              ? await platform.getElementRects({reference, floating, strategy})
              : reset.rects;
        }

        ({x, y} = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }

      i = -1;
    }
  }

  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData,
  };
};
