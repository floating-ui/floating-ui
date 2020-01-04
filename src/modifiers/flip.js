// @flow
import type { Placement, Boundary, RootBoundary } from '../enums';
import type { ModifierArguments, Modifier, Padding } from '../types';
import getOppositePlacement from '../utils/getOppositePlacement';
import getBasePlacement from '../utils/getBasePlacement';
import getVariation from '../utils/getVariation';
import getOppositeVariationPlacement from '../utils/getOppositeVariationPlacement';
import mergePaddingObject from '../utils/mergePaddingObject';
import expandToHashMap from '../utils/expandToHashMap';
import detectOverflow from '../utils/detectOverflow';
import {
  basePlacements,
  start,
  top,
  bottom,
  right,
  left,
  viewport,
  clippingParents,
} from '../enums';

type Options = {
  fallbackPlacements: Array<Placement>,
  padding: Padding,
  boundary: Boundary,
  rootBoundary: RootBoundary,
  flipVariations: boolean,
};

function getExpandedFallbackPlacements(placement: Placement): Array<Placement> {
  const oppositePlacement = getOppositePlacement(placement);

  return [
    getOppositeVariationPlacement(placement),
    oppositePlacement,
    getOppositeVariationPlacement(oppositePlacement),
  ];
}

function flip({ state, options, name }: ModifierArguments<Options>) {
  const {
    fallbackPlacements: specifiedFallbackPlacements,
    padding = 0,
    boundary = clippingParents,
    rootBoundary = viewport,
    flipVariations = true,
  } = options;

  const preferredPlacement = state.options.placement;
  const basePlacement = getBasePlacement(preferredPlacement);
  const isBasePlacement = basePlacement === preferredPlacement;

  const fallbackPlacements =
    specifiedFallbackPlacements ||
    (isBasePlacement
      ? [getOppositePlacement(preferredPlacement)]
      : getExpandedFallbackPlacements(preferredPlacement));

  const placementOrder = [preferredPlacement, ...fallbackPlacements];
  const flipIndex = state.modifiersData[name].index;
  const flippedPlacement: Placement = placementOrder[flipIndex];

  const referenceRect = state.rects.reference;
  const popperRect = state.rects.popper;

  const overflow = detectOverflow(state, {
    placement: flippedPlacement,
    boundary,
    rootBoundary,
  });

  if (!flippedPlacement) {
    // If none of the placements fit, we still want to use the better-fitting
    // flipped variation if possible
    const fallbackVariation = state.modifiersData[name].fallbackVariation;
    if (fallbackVariation && state.placement !== fallbackVariation) {
      state.placement = fallbackVariation;
      state.reset = true;
    }

    return;
  }

  const baseFlippedPlacement = getBasePlacement(flippedPlacement);
  const variation = getVariation(flippedPlacement);
  const isVertical = [top, bottom].includes(baseFlippedPlacement);
  const isStartVariation = variation === start;
  const len = isVertical ? 'width' : 'height';
  const paddingObject = mergePaddingObject(
    typeof padding !== 'number'
      ? padding
      : expandToHashMap(padding, basePlacements)
  );

  const edge =
    referenceRect[len] < popperRect[len]
      ? isVertical
        ? isStartVariation
          ? right
          : left
        : isStartVariation
        ? bottom
        : top
      : isVertical
      ? isStartVariation
        ? left
        : right
      : isStartVariation
      ? top
      : bottom;

  let fits =
    overflow[baseFlippedPlacement] + paddingObject[baseFlippedPlacement] <= 0;

  if (flipVariations && !isBasePlacement) {
    const fitsEdge = overflow[edge] + paddingObject[edge] <= 0;
    fits = fits && fitsEdge;

    if (fitsEdge && !state.modifiersData[name].fallbackVariation) {
      state.modifiersData[name].fallbackVariation = flippedPlacement;
    }
  }

  if (!fits) {
    state.modifiersData[name].index += 1;
    state.reset = true;
  } else if (fits && state.placement !== flippedPlacement) {
    state.placement = flippedPlacement;
    state.reset = true;
  }
}

export default ({
  name: 'flip',
  enabled: true,
  phase: 'main',
  fn: flip,
  requires: [],
  requiresIfExists: ['offset'],
  data: { index: 0 },
}: Modifier<Options>);
