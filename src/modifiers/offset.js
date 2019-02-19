// @flow
import type { Placement } from '../enums';
import type { State, Modifier, Rect } from '../types';
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

export function offset(state: State, options: ?{ offset: ?OffsetsFunction }) {
  if (options && typeof options.offset === 'function') {
    const [x, y] = distanceAndSkiddingToXY(
      state.placement,
      state.measures,
      options.offset
    );

    state.offsets.popper.x += x;
    state.offsets.popper.y += y;
  }

  return state;
}

export default ({
  name: 'offset',
  enabled: true,
  phase: 'main',
  fn: offset,
}: Modifier);
