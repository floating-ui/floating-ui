// @flow
import type { Placement } from '../enums';
import type { Modifier, ModifierArguments, Rect, Coords } from '../types';
import getBasePlacement from '../utils/getBasePlacement';
import { top, left, right } from '../enums';
import isVerticalPlacement from '../utils/isVerticalPlacement';

type OffsetValue =
  | number
  | {|
      mainAxis?: number,
      crossAxis?: number,
    |};

type OffsetFunction = ({
  popper: Rect,
  reference: Rect,
  placement: Placement,
}) =>
  | number
  | {|
      mainAxis?: number,
      crossAxis?: number,
    |};

export type Offset = OffsetValue | OffsetFunction;

export function convertValueToCoords({
  placement,
  rects,
  value,
  ...coords
}: {
  placement: Placement,
  rects: { popper: Rect, reference: Rect },
  value: Offset,
  ...Coords,
}): Coords {
  const basePlacement = getBasePlacement(placement);
  const multiplier = [left, top].includes(basePlacement) ? -1 : 1;

  const rawValue =
    typeof value === 'function' ? value({ ...rects, placement }) : value;
  let { mainAxis, crossAxis } =
    typeof rawValue === 'number'
      ? { mainAxis: rawValue, crossAxis: rawValue }
      : { mainAxis: 0, crossAxis: 0, ...rawValue };

  mainAxis = mainAxis * multiplier;
  crossAxis = crossAxis;

  return !isVerticalPlacement(basePlacement)
    ? { x: coords.x + mainAxis, y: coords.y + crossAxis }
    : { x: coords.x + crossAxis, y: coords.y + mainAxis };
}

export const offset = (value: Offset): Modifier => ({
  name: 'offset',
  fn(modifierArguments: ModifierArguments) {
    const { x, y, placement, rects } = modifierArguments;
    return convertValueToCoords({ placement, rects, x, y, value });
  },
});
