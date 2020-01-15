// @flow
import type { Placement, Boundary, RootBoundary } from '../enums';
import type { ModifierArguments, Modifier, Padding } from '../types';
import getOppositePlacement from '../utils/getOppositePlacement';
import getBasePlacement from '../utils/getBasePlacement';
import getOppositeVariationPlacement from '../utils/getOppositeVariationPlacement';
import detectOverflow from '../utils/detectOverflow';
import computeAutoPlacement from '../utils/computeAutoPlacement';
import uniqueBy from '../utils/uniqueBy';
import { bottom, top, start, right, left, auto } from '../enums';
import getVariation from '../utils/getVariation';

type Options = {
  fallbackPlacements: Array<Placement>,
  padding: Padding,
  boundary: Boundary,
  rootBoundary: RootBoundary,
  flipVariations: boolean,
};

function getExpandedFallbackPlacements(placement: Placement): Array<Placement> {
  if (getBasePlacement(placement) === auto) {
    return [];
  }

  const oppositePlacement = getOppositePlacement(placement);

  return [
    getOppositeVariationPlacement(placement),
    oppositePlacement,
    getOppositeVariationPlacement(oppositePlacement),
  ];
}

function flip({ state, options }: ModifierArguments<Options>) {
  const {
    fallbackPlacements: specifiedFallbackPlacements,
    padding,
    boundary,
    rootBoundary,
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

  const placements = uniqueBy(
    [preferredPlacement, ...fallbackPlacements].reduce((acc, placement) => {
      return getBasePlacement(placement) === auto
        ? acc.concat(
            computeAutoPlacement(state, {
              placement,
              boundary,
              rootBoundary,
              padding,
              flipVariations,
            })
          )
        : acc.concat(placement);
    }, []),
    placement => placement
  );

  const referenceRect = state.rects.reference;
  const popperRect = state.rects.popper;

  const placementOverflowData = placements.reduce((acc, placement) => {
    const basePlacement = getBasePlacement(placement);
    const isStartVariation = getVariation(placement) === start;
    const isVertical = [top, bottom].includes(basePlacement);
    const len = isVertical ? 'width' : 'height';

    const overflow = detectOverflow(state, {
      placement,
      boundary,
      rootBoundary,
      padding,
    });

    let mainVariationSide: any = isVertical
      ? isStartVariation
        ? right
        : left
      : isStartVariation
      ? bottom
      : top;

    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide);
    }

    const altVariationSide: any = getOppositePlacement(mainVariationSide);

    acc[placement] = [
      // checks
      overflow[basePlacement] <= 0,
      overflow[mainVariationSide] <= 0,
      overflow[altVariationSide] <= 0,
    ];

    return acc;
  }, {});

  // `2` may be desired in some cases – research later
  let checks = flipVariations ? 3 : 1;
  let firstFittingPlacement = placements[0];

  for (let i = checks; i >= 0; checks--) {
    const tryPlacement = placements.find(placement => {
      return placementOverflowData[placement]
        .slice(0, checks)
        .every(check => check);
    });

    if (tryPlacement) {
      firstFittingPlacement = tryPlacement;
      break;
    }
  }

  if (state.placement !== firstFittingPlacement) {
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
}

export default ({
  name: 'flip',
  enabled: true,
  phase: 'main',
  fn: flip,
  requiresIfExists: ['offset'],
}: Modifier<Options>);
