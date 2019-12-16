// @flow
import type { Placement } from '../enums';
import type { ModifierArguments, Modifier, Rect } from '../types';
import getBasePlacement from '../utils/getBasePlacement';
import { top, left, right } from '../enums';

export function distanceAndSkiddingToXY(
  placement: Placement,
  measures: { popper: Rect, reference: Rect },
  offsetValue: OffsetsFunction | [number, number]
): [number, number] {
  const basePlacement = getBasePlacement(placement);
  const invertDistance = [left, top].includes(basePlacement) ? -1 : 1;

  let [distance, skidding] =
    typeof offsetValue === 'function'
      ? offsetValue({
          ...measures,
          placement,
        })
      : offsetValue;

  distance = (distance || 0) * invertDistance;
  skidding = skidding || 0;

  return [left, right].includes(basePlacement)
    ? [distance, skidding]
    : [skidding, distance];
}

type OffsetsFunction = ({
  popper: Rect,
  reference: Rect,
  placement: Placement,
}) => [?number, ?number];

type Options = {
  offset: OffsetsFunction | [number, number],
};

function offset({ state, options, name }: ModifierArguments<Options>) {
  const { offset = [0, 0] } = options;

  const [x, y] = distanceAndSkiddingToXY(
    state.placement,
    state.measures,
    offset
  );

  state.modifiersData.popperOffsets.x += x;
  state.modifiersData.popperOffsets.y += y;

  state.modifiersData[name] = { x, y };

  return state;
}

export default ({
  name: 'offset',
  enabled: true,
  phase: 'read',
  requires: ['popperOffsets'],
  fn: offset,
}: Modifier<Options>);
