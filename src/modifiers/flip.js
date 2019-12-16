// @flow
import type { Placement } from '../enums';
import type { ModifierArguments, Modifier, Padding } from '../types';
import getOppositePlacement from '../utils/getOppositePlacement';
import getBasePlacement from '../utils/getBasePlacement';
import mergePaddingObject from '../utils/mergePaddingObject';
import expandToHashMap from '../utils/expandToHashMap';
import { basePlacements } from '../enums';

type Options = {
  fallbackPlacements: Array<Placement>,
  padding: Padding,
};

function flip({ state, options, name }: ModifierArguments<Options>) {
  const placement = state.placement;
  const defaultFallbackPlacements = [
    getOppositePlacement(state.options.placement),
  ];
  const {
    fallbackPlacements = defaultFallbackPlacements,
    padding = 0,
  } = options;
  const overflow = state.modifiersData['detectOverflow:flip'].overflowOffsets;
  const flipIndex = state.modifiersData[name].index;

  const paddingObject = mergePaddingObject(
    typeof padding !== 'number'
      ? padding
      : expandToHashMap(padding, basePlacements)
  );

  const placementOrder = [state.options.placement, ...fallbackPlacements];

  const flippedPlacement = placementOrder[flipIndex];

  if (!flippedPlacement && placement !== state.options.placement) {
    state.placement = state.options.placement;
    state.reset = true;
    return state;
  }

  if (!flippedPlacement && placement === state.options.placement) {
    return state;
  }

  const basePlacement = getBasePlacement(flippedPlacement);
  const fits = overflow[basePlacement] + paddingObject[basePlacement] <= 0;

  if (!fits) {
    state.modifiersData[name].index += 1;
    state.reset = true;
    return state;
  } else if (fits && state.placement !== flippedPlacement) {
    state.placement = flippedPlacement;
    state.reset = true;
    return state;
  }

  return state;
}

export default ({
  name: 'flip',
  enabled: true,
  phase: 'main',
  fn: flip,
  requires: ['detectOverflow:flip'],
  optionallyRequires: ['offset'],
  data: { index: 0 },
}: Modifier<Options>);
