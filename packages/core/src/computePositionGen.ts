import type {
  ComputePositionConfig,
  ComputePositionReturn,
  Middleware,
  MiddlewareData,
} from './types';
import type {ElementRects} from './utils';
import {isGenerator} from './utils/isGenerator';
import {computeCoordsFromPlacement} from './computeCoordsFromPlacement';

export function* computePositionGen(
  reference: unknown,
  floating: unknown,
  config: ComputePositionConfig,
): Generator<any, ComputePositionReturn, any> {
  const {
    placement = 'bottom',
    strategy = 'absolute',
    middleware = [],
    platform,
  } = config;

  const validMiddleware = middleware.filter(Boolean) as Array<Middleware>;

  const rtl = (yield platform.isRTL?.(floating)) ?? false;

  let rects: ElementRects = yield platform.getElementRects({
    reference,
    floating,
    strategy,
  });
  let {x, y} = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let middlewareData: MiddlewareData = {};
  let resetCount = 0;

  for (let i = 0; i < validMiddleware.length; i++) {
    const {name, fn} = validMiddleware[i];

    const middlewareResult = fn({
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

    const result = isGenerator(middlewareResult)
      ? yield* middlewareResult
      : yield middlewareResult;

    const {x: nextX, y: nextY, data, reset} = result || {};

    x = nextX ?? x;
    y = nextY ?? y;
    middlewareData = {
      ...middlewareData,
      [name]: {
        ...middlewareData[name],
        ...data,
      },
    };

    if (reset && resetCount < 50) {
      resetCount++;

      if (typeof reset === 'object') {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects =
            reset.rects === true
              ? yield platform.getElementRects({reference, floating, strategy})
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
}
