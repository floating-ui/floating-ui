import type {
  ComputePositionConfig,
  ComputePositionReturn,
  MiddlewareData,
  MiddlewareReturn,
} from './types';
import type {ElementRects, Placement} from './utils';
import {isGenerator} from './utils/isGenerator';
import {getCoordinates} from './getCoordinates';

const EMPTY_ARRAY: never[] = [];

export function* computePositionGen(
  reference: unknown,
  floating: unknown,
  config: ComputePositionConfig,
): Generator<any, ComputePositionReturn, any> {
  const {
    side = 'bottom',
    align = 'center',
    strategy = 'absolute',
    middleware = EMPTY_ARRAY,
    platform,
  } = config;

  const elements = {reference, floating};
  const placement: Placement = {side, align};
  let renderedSide = placement.side;
  let renderedAlign = placement.align;

  const rtl = (yield platform.isRTL?.(floating)) ?? false;

  let rects: ElementRects = yield platform.getElementRects({
    reference,
    floating,
    strategy,
  });
  let {x, y} = getCoordinates(rects, renderedSide, renderedAlign, rtl);
  let middlewareData: MiddlewareData = {};
  let resetCount = 0;

  for (let i = 0; i < middleware.length; i++) {
    const middlewareItem = middleware[i];

    if (!middlewareItem) {
      continue;
    }

    const {name, fn} = middlewareItem;

    const middlewareResult = fn({
      x,
      y,
      initialSide: placement.side,
      initialAlign: placement.align,
      side: renderedSide,
      align: renderedAlign,
      strategy,
      middlewareData,
      rects,
      platform,
      elements,
    });

    const result: MiddlewareReturn = isGenerator(middlewareResult)
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
        renderedSide = reset.side || renderedSide;
        renderedAlign = reset.align || renderedAlign;

        if (reset.rects) {
          rects =
            reset.rects === true
              ? yield platform.getElementRects({reference, floating, strategy})
              : reset.rects;
        }

        ({x, y} = getCoordinates(rects, renderedSide, renderedAlign, rtl));
      }

      i = -1;
    }
  }

  return {
    x,
    y,
    side: renderedSide,
    align: renderedAlign,
    strategy,
    middlewareData,
  };
}
