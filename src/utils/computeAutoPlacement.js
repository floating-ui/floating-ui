// @flow
import type { State, Padding } from '../types';
import type {
  Placement,
  Boundary,
  RootBoundary,
  ComputedPlacement,
} from '../enums';
import getVariation from './getVariation';
import { variationPlacements, basePlacements } from '../enums';
import detectOverflow from './detectOverflow';
import getBasePlacement from './getBasePlacement';

type Options = {
  placement: Placement,
  padding: Padding,
  boundary: Boundary,
  rootBoundary: RootBoundary,
  flipVariations: boolean,
};

export default function computeAutoPlacement(
  state: $Shape<State>,
  options: Options = {}
): Array<ComputedPlacement> {
  const {
    placement,
    boundary,
    rootBoundary,
    padding,
    flipVariations,
  } = options;

  const variation = getVariation(placement);
  const placements: any = variation
    ? flipVariations
      ? variationPlacements
      : variationPlacements.filter(placement => placement.includes(variation))
    : basePlacements;

  const overflows = placements.reduce((acc, placement) => {
    acc[placement] = detectOverflow(state, {
      placement,
      boundary,
      rootBoundary,
      padding,
    })[getBasePlacement(placement)];

    return acc;
  }, {});

  // $FlowFixMe
  return Object.keys(overflows).sort((a, b) => overflows[a] - overflows[b]);
}
