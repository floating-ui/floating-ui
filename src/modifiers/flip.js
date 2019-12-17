// @flow
import type { Placement } from '../enums';
import type { ModifierArguments, Modifier, Padding } from '../types';
import getOppositePlacement from '../utils/getOppositePlacement';
import getVariationPlacement from '../utils/getVariationPlacement';
import getOppositeVariationPlacement from '../utils/getOppositeVariationPlacement';
import getBasePlacement from '../utils/getBasePlacement';
import mergePaddingObject from '../utils/mergePaddingObject';
import expandToHashMap from '../utils/expandToHashMap';
import { basePlacements, right, bottom, left, top, start } from '../enums';

type Options = {
  fallbackPlacements: Array<Placement>,
  padding: Padding,
  checkVariation: boolean,
};

function flip({ state, options, name }: ModifierArguments<Options>) {
  const placement = state.placement;
  const defaultFallbackPlacements = [
    getOppositePlacement(state.options.placement),
  ];
  const {
    fallbackPlacements = defaultFallbackPlacements,
    padding = 0,
    checkVariation = true,
  } = options;

  const overflow = state.modifiersData['detectOverflow:flip'].overflowOffsets;
  const flipIndex = state.modifiersData[name].index;
  const paddingObject = mergePaddingObject(
    typeof padding !== 'number'
      ? padding
      : expandToHashMap(padding, basePlacements)
  );

  const placementOrder = [state.options.placement, ...fallbackPlacements];

  let flippedPlacement = placementOrder[flipIndex];

  if (!flippedPlacement && placement !== state.options.placement) {
    state.placement = state.options.placement;
    state.reset = true;
    return state;
  }

  if (!flippedPlacement && placement === state.options.placement) {
    return state;
  }

  const basePlacement = getBasePlacement(flippedPlacement);
  const fitsOnMainAxis =
    overflow[basePlacement] + paddingObject[basePlacement] <= 0;

  // Check alt axis to see if we can switch variation placements
  const variation = getVariationPlacement(flippedPlacement);
  if (variation && checkVariation && fitsOnMainAxis) {
    const isVertical = [top, bottom].includes(basePlacement);
    const isStartVariation = variation === start;
    const len = isVertical ? 'width' : 'height';

    const sideA = isStartVariation
      ? isVertical
        ? right
        : bottom
      : isVertical
      ? left
      : top;
    const sideB = isStartVariation
      ? isVertical
        ? left
        : top
      : isVertical
      ? right
      : bottom;

    const fitsA = overflow[sideA] + paddingObject[sideA] <= 0;
    const fitsB = overflow[sideB] + paddingObject[sideB] <= 0;

    const oppositeVariation = getOppositeVariationPlacement(flippedPlacement);
    const storedPlacement = state.modifiersData[`${name}#persistent`];

    const condition =
      state.measures.popper[len] < state.measures.reference[len]
        ? fitsA && !fitsB
        : !fitsA && fitsB;

    if (condition) {
      state.modifiersData[`${name}#persistent`] = oppositeVariation;
      flippedPlacement = oppositeVariation;
    } else if (storedPlacement) {
      state.modifiersData[`${name}#persistent`] = flippedPlacement;
      flippedPlacement = storedPlacement;
    }
  }

  if (!fitsOnMainAxis) {
    state.modifiersData[name].index += 1;
    state.reset = true;
    return state;
  } else if (fitsOnMainAxis && state.placement !== flippedPlacement) {
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
