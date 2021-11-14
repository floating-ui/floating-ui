// @flow
import { top, bottom, type Placement } from '../enums';
import getBasePlacement from './getBasePlacement';

export default function isVerticalPlacement(placement: Placement): boolean {
  return [top, bottom].indexOf(getBasePlacement(placement)) !== -1;
}
