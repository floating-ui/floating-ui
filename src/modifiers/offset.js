// @flow
import type { Placement } from '../enums';
import type { ModifierArguments, Modifier, Rect } from '../types';
import getBasePlacement from '../utils/getBasePlacement';

export function distanceAndSkiddingToXY(
  placement: Placement,
  measures: { popper: Rect, reference: Rect },
  getOffsets: OffsetsFunction
): [number, number] {
  const basePlacement = getBasePlacement(placement);

  const invertDistance = ['left', 'top'].includes(basePlacement) ? -1 : 1;
  const invertSkidding = ['top', 'bottom'].includes(basePlacement) ? -1 : 1;

  let [distance, skidding] = getOffsets({
    ...measures,
    placement,
  });

  distance = (distance || 0) * invertDistance;
  skidding = (distance || 0) * invertSkidding;

  return ['left', 'right'].includes(basePlacement)
    ? [distance, skidding]
    : [skidding, distance];
}

type OffsetsFunction = ({
  popper: Rect,
  reference: Rect,
  placement: Placement,
}) => [?number, ?number];

type Options = { offset: ?OffsetsFunction };

export function offset({ state, options = {} }: ModifierArguments<Options>) {
  if (typeof options.offset === 'function') {
    const [x, y] = distanceAndSkiddingToXY(
      state.placement,
      state.measures,
      options.offset
    );

    state.modifiersData.popperOffsets.default.x += x;
    state.modifiersData.popperOffsets.default.y += y;
  }

  return state;
}

export default ({
  name: 'offset',
  enabled: true,
  phase: 'main',
  fn: offset,
}: Modifier<Options>);
