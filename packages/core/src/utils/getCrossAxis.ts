import {Axis} from '../types';

export function getCrossAxis(axis: Axis): Axis {
  return axis === 'x' ? 'y' : 'x';
}
