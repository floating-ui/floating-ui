// @flow
import type { Placement } from '../enums';

export default function getMainAxisFromPlacement(
  placement: Placement
): 'x' | 'y' {
  return ['top', 'bottom'].includes(placement) ? 'x' : 'y';
}
