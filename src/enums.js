// @flow
export const top: 'top' = 'top';
export const bottom: 'bottom' = 'bottom';
export const right: 'right' = 'right';
export const left: 'left' = 'left';
export const auto: 'auto' = 'auto';
export type BasePlacement =
  | typeof top
  | typeof bottom
  | typeof right
  | typeof left
  | typeof auto;
export const basePlacements: Array<BasePlacement> = [top, bottom, right, left];

export const start: 'start' = 'start';
export const end: 'end' = 'end';
export type VariationPlacement = typeof start | typeof end;

export type Placement =
  | 'auto'
  | 'auto-start'
  | 'auto-end'
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
      (`${placement}-${start}`: any),
      (`${placement}-${end}`: any),
    ]),
  []
);

// modifiers that need to read the DOM
export const read: 'read' = 'read';
// pure-logic modifiers
export const main: 'main' = 'main';
// modifier with the purpose to write to the DOM (or write into a framework state)
export const write: 'write' = 'write';

export type ModifierPhases = typeof read | typeof main | typeof write;
