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

export function flip({ state, options = {} }: ModifierArguments<Options>) {
  const placement = state.placement;
  const defaultFallbackPlacements = [
    getOppositePlacement(state.options.placement),
  ];
  const {
    fallbackPlacements = defaultFallbackPlacements,
    padding = 0,
  } = options;
  const overflow = state.modifiersData.detectOverflow.visibleArea;
  const flipIndex = state.modifiersData.flip.index;

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

  const flippedBasePlacement = getBasePlacement(flippedPlacement);

  // Check the difference in size between the two so the flip modifier knows
  // it truly won't fit due to margins/padding difference based on the placement
  // This fixes the "flip flicker" loop issue
  let placementSizeDiff = 0;
  if (state.domPlacement) {
    const baseDomPlacement = getBasePlacement(state.domPlacement);
    const oppositeDomPlacement = getOppositePlacement(baseDomPlacement);
    placementSizeDiff =
      state.placementClientRects[baseDomPlacement][oppositeDomPlacement] -
      state.placementClientRects[flippedBasePlacement][oppositeDomPlacement];
  }

  const fits =
    overflow[flippedBasePlacement] +
      paddingObject[flippedBasePlacement] +
      placementSizeDiff <=
    0;

  if (!fits) {
    state.modifiersData.flip.index += 1;
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
  requires: ['detectOverflow'],
  data: { index: 0 },
}: Modifier<Options>);
