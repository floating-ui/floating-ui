import {computeCoordsFromPlacement} from './computeCoordsFromPlacement';
import type {ComputePosition, Middleware, MiddlewareData} from './types';

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

  const validMiddleware = middleware.filter(Boolean) as Middleware[];
  const rtl = await platform.isRTL?.(floating);

  let rects = await platform.getElementRects({reference, floating, strategy});
  let {x, y} = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let middlewareData: MiddlewareData = {};
  let resetCount = 0;

  for (let i = 0; i < validMiddleware.length; i++) {
    const {name, fn} = validMiddleware[i];

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
      platform,
      elements: {reference, floating},
    });

    x = nextX ?? x;
    y = nextY ?? y;

    middlewareData = {
      ...middlewareData,
      [name]: {
        ...middlewareData[name],
        ...data,
      },
    };

    if (reset && resetCount <= 50) {
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
