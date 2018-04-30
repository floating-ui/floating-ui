// @flow
import type { Placement } from '../enums';
export default (placement: Placement): 'x' | 'y' =>
  ['top', 'bottom'].includes(placement) ? 'x' : 'y';
