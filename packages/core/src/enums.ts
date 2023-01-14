import type {AlignedPlacement, Placement, Side} from './types';

export const sides: Side[] = ['top', 'right', 'bottom', 'left'];
export const allPlacements = sides.reduce(
  (acc: Placement[], side) =>
    acc.concat(
      side,
      `${side}-start` as AlignedPlacement,
      `${side}-end` as AlignedPlacement
    ),
  []
);
