// @flow
export const top: 'top' = 'top';
export const bottom: 'bottom' = 'bottom';
export const right: 'right' = 'right';
export const left: 'left' = 'left';
export type BasePlacement =
  | typeof top
  | typeof bottom
  | typeof right
  | typeof left;
export const basePlacements: Array<BasePlacement> = [top, bottom, right, left];

export type Placement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'left'
  | 'left-start'
  | 'left-end';

export const placements: Array<Placement> = basePlacements.reduce(
  (acc: Array<Placement>, placement: BasePlacement): Array<Placement> =>
    acc.concat([
      placement,
      (`${placement}-start`: any),
      (`${placement}-end`: any),
    ]),
  []
);
