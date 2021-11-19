// @flow
import type { Placement } from '../enums';

const hash = { start: 'end', end: 'start' };

export default function getOppositeVariationPlacement(
  placement: Placement
): Placement {
  return (placement.replace(/start|end/g, matched => hash[matched]): any);
}
