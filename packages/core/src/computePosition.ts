import {computeCoordsFromPlacement} from './computeCoordsFromPlacement';
import type {
  ComputePosition,
  ComputePositionReturn,
  Middleware,
  MiddlewareData,
} from './types';

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a reference element when it is given a certain positioning strategy.
 *
 * This export does not have any `platform` interface logic. You will need to
 * write one for the platform you are using Floating UI with.
 */
export const computePosition: ComputePosition = async (
  reference,
  floating,
  config
): Promise<ComputePositionReturn> => {
  const {
    placement = 'bottom',
    strategy = 'absolute',
    middleware = [],
    platform,
  } = config;

  const validMiddleware = middleware.filter(Boolean) as Middleware[];
  const rtl = await platform.isRTL?.(floating);

  if (__DEV__) {
    if (platform == null) {
      console.error(
        [
          'Floating UI: `platform` property was not passed to config. If you',
          'want to use Floating UI on the web, install @floating-ui/dom',
          'instead of the /core package. Otherwise, you can create your own',
          '`platform`: https://floating-ui.com/docs/platform',
        ].join(' ')
      );
    }

    if (
      validMiddleware.filter(
        ({name}) => name === 'autoPlacement' || name === 'flip'
      ).length > 1
    ) {
      throw new Error(
        [
          'Floating UI: duplicate `flip` and/or `autoPlacement` middleware',
          'detected. This will lead to an infinite loop. Ensure only one of',
          'either has been passed to the `middleware` array.',
        ].join(' ')
      );
    }

    if (!reference || !floating) {
      console.error(
        [
          'Floating UI: The reference and/or floating element was not defined',
          'when `computePosition()` was called. Ensure that both elements have',
          'been created and can be measured.',
        ].join(' ')
      );
    }
  }

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

    if (__DEV__) {
      if (resetCount > 50) {
        console.warn(
          [
            'Floating UI: The middleware lifecycle appears to be running in an',
            'infinite loop. This is usually caused by a `reset` continually',
            'being returned without a break condition.',
          ].join(' ')
        );
      }
    }

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
      continue;
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
