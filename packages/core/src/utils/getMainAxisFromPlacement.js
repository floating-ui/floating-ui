// @flow
import type { Placement } from '../enums';
import isVerticalPlacement from './isVerticalPlacement';

export default function getMainAxisFromPlacement(
  placement: Placement
): 'x' | 'y' {
  return isVerticalPlacement(placement) ? 'x' : 'y';
}
