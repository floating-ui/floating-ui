import type {Placement} from '../types';

const hash = {start: 'end', end: 'start'};

export function getOppositeAlignmentPlacement(placement: Placement): Placement {
  return placement.replace(
    /start|end/g,
    (matched) => (hash as any)[matched]
  ) as Placement;
}
