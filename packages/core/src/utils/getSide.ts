import type {Side, Placement} from '../types';

export function getSide(placement: Placement): Side {
  return placement.split('-')[0] as Side;
}
