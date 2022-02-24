import type {Side, Placement} from './types';

export const sides: Side[] = ['top', 'right', 'bottom', 'left'];
export const allPlacements = sides.reduce(
  (acc: Placement[], side) => acc.concat(side, `${side}-start`, `${side}-end`),
  []
);
