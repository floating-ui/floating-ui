// @flow
import type {
  PositioningStrategy,
  Coords,
  Reference,
  Popper,
  Modifier,
  Platform,
  SideObject,
} from './types';
import { auto, type Placement } from './enums';
import computeCoords from './utils/computeCoords';
import getBasePlacement from './utils/getBasePlacement';

type Config = {
  platform: Platform,
  placement: Placement,
  strategy: PositioningStrategy,
  modifiers: Array<Modifier>,
};

type PositionReturn = {|
  ...Coords,
  placement: Placement,
  strategy: PositioningStrategy,
  modifiersData: {
    arrow?: {|
      x?: number,
      y?: number,
      centerOffset: number,
    |},
    flip?: {|
      skip: boolean,
      index: number,
      overflows: Array<{|
        placement: Placement,
        overflows: [number] | [number, number, number],
      |}>,
    |},
    auto?: {|
      skip: boolean,
      overflows: Array<{
        placement: Placement,
        overflows: [number] | [number, number, number],
      }>,
    |},
    hide?: {|
      isReferenceHidden: boolean,
      hasPopperEscaped: boolean,
      referenceClippingOffsets: SideObject,
      popperEscapeOffsets: SideObject,
    |},
    size?: {|
      width: number,
      height: number,
    |},
    [key: string]: any,
  },
|};

export async function position(
  reference: Reference,
  popper: Popper,
  config: Config = {}
): Promise<PositionReturn> {
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
    const { data: modifierData, ...nextCoords } = await fn({
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

    statefulCoords = nextCoords;
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
}
