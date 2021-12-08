import {Axis, Placement} from '../types';
import {getBasePlacement} from './getBasePlacement';

export function getMainAxisFromPlacement(placement: Placement): Axis {
  return ['top', 'bottom'].includes(getBasePlacement(placement)) ? 'x' : 'y';
}
