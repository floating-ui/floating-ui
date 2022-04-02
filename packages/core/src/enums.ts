import type {Side, Placement, AlignedPlacement} from './types';

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
