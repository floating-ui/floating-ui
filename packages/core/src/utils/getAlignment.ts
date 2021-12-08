import type {Alignment} from '../types';

export function getAlignment<T extends string>(placement: T): Alignment {
  return placement.split('-')[1] as Alignment;
}
