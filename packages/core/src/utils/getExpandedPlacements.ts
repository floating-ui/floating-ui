import type {Placement} from '../types';
import {getOppositePlacement} from './getOppositePlacement';
import {getOppositeAlignmentPlacement} from './getOppositeAlignmentPlacement';

export function getExpandedPlacements(placement: Placement): Array<Placement> {
  const oppositePlacement = getOppositePlacement(placement);

  return [
    getOppositeAlignmentPlacement(placement),
    oppositePlacement,
    getOppositeAlignmentPlacement(oppositePlacement),
  ];
}
