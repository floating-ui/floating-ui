import {Placement} from '..';
import {BasePlacement} from './types';

export const basePlacements: BasePlacement[] = [
  'top',
  'right',
  'bottom',
  'left',
];
export const allPlacements = basePlacements.reduce(
  (acc: Placement[], basePlacement) =>
    acc.concat(basePlacement, `${basePlacement}-start`, `${basePlacement}-end`),
  []
);
