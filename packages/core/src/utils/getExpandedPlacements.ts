import type {Placement} from '../types';
import {getOppositeAlignmentPlacement} from './getOppositeAlignmentPlacement';
import {getOppositePlacement} from './getOppositePlacement';

export function getExpandedPlacements(placement: Placement): Array<Placement> {
  const oppositePlacement = getOppositePlacement(placement);

  return [
    getOppositeAlignmentPlacement(placement),
    oppositePlacement,
    getOppositeAlignmentPlacement(oppositePlacement),
  ];
}
