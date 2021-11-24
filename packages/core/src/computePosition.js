// @flow
import type { ComputePosition } from './types';
import computeCoords from './utils/computeCoords';

export const computePosition: ComputePosition = async (
  reference,
  popper,
  config
) => {
  const {
    placement = 'bottom',
    strategy = 'absolute',
    modifiers = [],
    platform,
  } = config;

  if (__DEV__) {
    if (platform == null) {
      throw new Error(
        [
          'Popper: `platform` property was not passed. Ensure you are using',
          'the @popperjs/dom package to use Popper on the web.',
        ].join(' ')
      );
    }
  }

  // Although the DOM provides a synchronous way to get a rect, other
  // platforms like React Native provide async methods. This ensures
  // we are compatible with any platform.
  const rects = await platform.getElementRects({ reference, popper, strategy });

  // Places the popper using the 12 different placement types. The most
  // basic form of positioning.
  let { x, y } = computeCoords({ ...rects, placement });

  let statefulPlacement = placement;

  // Modifiers have the ability to reset the modifier lifecycle and start
  // the process over again. Mainly used by the `flip` modifier which changes
  // the placement, resulting in the modifiers needing to re-run their logic
  // for the new placement.
  let isReset = false;

  // Custom modifiers data.
  let modifiersData = {};

  const scheduleReset = ({ placement }) => {
    statefulPlacement = placement;
    isReset = true;
  };

  let __DEBUG_LOOP_COUNT = 0;
  for (let i = 0; i < modifiers.length; i++) {
    if (__DEV__) {
      __DEBUG_LOOP_COUNT++;
      if (__DEBUG_LOOP_COUNT > 100) {
        throw new Error('Popper: Infinite loop detected.');
      }
    }

    if (i === 0) {
      ({ x, y } = computeCoords({ ...rects, placement: statefulPlacement }));
    }

    const { name, fn } = modifiers[i];
    const {
      x: nextX,
      y: nextY,
      data: modifierData,
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      modifiersData,
      scheduleReset,
      rects,
      platform,
      elements: { reference, popper },
    });

    x = nextX ?? x;
    y = nextY ?? y;

    modifiersData = { ...modifiersData, [name]: modifierData ?? {} };

    if (isReset) {
      i = -1;
      isReset = false;
      continue;
    }
  }

  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    modifiersData,
  };
};
