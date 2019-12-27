// @flow
import type { Placement } from '../enums';
import type { ModifierArguments, Modifier, Rect } from '../types';
import getBasePlacement from '../utils/getBasePlacement';
import { top, left, right, placements } from '../enums';

export function distanceAndSkiddingToXY(
  placement: Placement,
  measures: { popper: Rect, reference: Rect },
  offsetValue: OffsetsFunction | [number, number]
): { x: number, y: number } {
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
    ? { x: distance, y: skidding }
    : { x: skidding, y: distance };
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

  const data = placements.reduce((acc, placement) => {
    acc[placement] = distanceAndSkiddingToXY(placement, state.measures, offset);
    return acc;
  }, {});

  const { x, y } = data[state.placement];

  state.modifiersData.popperOffsets.x += x;
  state.modifiersData.popperOffsets.y += y;

  state.modifiersData[name] = data;

  return state;
}

export default ({
  name: 'offset',
  enabled: true,
  phase: 'main',
  requires: ['popperOffsets'],
  fn: offset,
}: Modifier<Options>);
