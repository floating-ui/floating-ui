// @flow
import { type Placement, auto } from '../enums';
import getBasePlacement from './getBasePlacement';
import getOppositePlacement from './getOppositePlacement';
import getOppositeVariationPlacement from './getOppositeVariationPlacement';

export default function getExpandedPlacements(
  placement: Placement
): Array<Placement> {
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
