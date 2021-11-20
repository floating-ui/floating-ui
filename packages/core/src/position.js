// @flow
import type { Position } from './types';
import { auto } from './enums';
import computeCoords from './utils/computeCoords';
import getBasePlacement from './utils/getBasePlacement';

export const position: Position = async (reference, popper, config) => {
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
          'Popper: `platform` property was not passed. If you are using Popper',
          'on the web, import the `dom` platform.',
        ].join(' ')
      );
    }

    if (
      getBasePlacement(placement) === auto &&
      !modifiers.find(({ name }) => name === auto)
    ) {
      console.error(
        [
          'Popper: In order to use auto placements, the `auto` modifier must',
          'be passed to the `modifiers` array.',
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
  const coords = computeCoords({ ...rects, placement });

  let statefulPlacement = placement;
  let statefulCoords = coords;

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
      statefulCoords = computeCoords({
        ...rects,
        placement: statefulPlacement,
      });
    }

    const { name, fn } = modifiers[i];
    const {
      x,
      y,
      data: modifierData,
    } = await fn({
      initialPlacement: placement,
      placement: statefulPlacement,
      coords: statefulCoords,
      strategy,
      modifiersData,
      scheduleReset,
      rects,
      platform,
      elements: { reference, popper },
    });

    statefulCoords = { x, y };
    modifiersData = { ...modifiersData, [name]: modifierData ?? {} };

    if (isReset) {
      i = -1;
      isReset = false;
      continue;
    }
  }

  return {
    ...statefulCoords,
    placement: statefulPlacement,
    strategy,
    modifiersData,
  };
};
