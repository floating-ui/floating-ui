import {BasePlacement, Placement} from '../types';

export function getBasePlacement(placement: Placement): BasePlacement {
  return placement.split('-')[0] as BasePlacement;
}
