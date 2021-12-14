import type {ComputePosition, ComputePositionReturn} from './types';
import {computeCoordsFromPlacement} from './computeCoordsFromPlacement';

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
      middleware.filter(({name}) => name === 'autoPlacement' || name === 'flip')
        .length > 1
    ) {
      throw new Error(
        [
          'Floating UI: duplicate `flip` and/or `autoPlacement`',
          'middleware detected. This will lead to an infinite loop. Ensure only',
          'one of either has been passed to the `middleware` array.',
        ].join(' ')
      );
    }
  }

  let rects = await platform.getElementRects({reference, floating, strategy});

  let {x, y} = computeCoordsFromPlacement({...rects, placement});

  let statefulPlacement = placement;
  let middlewareData = {};

  let _debug_loop_count_ = 0;
  for (let i = 0; i < middleware.length; i++) {
    if (__DEV__) {
      _debug_loop_count_++;
      if (_debug_loop_count_ > 100) {
        throw new Error(
          [
            'Floating UI: The middleware lifecycle appears to be',
            'running in an infinite loop. This is usually caused by a `reset`',
            'continually being returned without a break condition.',
          ].join(' ')
        );
      }
    }

    const {name, fn} = middleware[i];
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

    middlewareData = {...middlewareData, [name]: data ?? {}};

    if (reset) {
      if (typeof reset === 'object' && reset.placement) {
        statefulPlacement = reset.placement;
      }

      rects = await platform.getElementRects({reference, floating, strategy});

      ({x, y} = computeCoordsFromPlacement({
        ...rects,
        placement: statefulPlacement,
      }));

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
