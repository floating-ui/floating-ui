import type {Placement} from '../../../src';

export function stringifyPlacement(placement: Placement) {
  return `${placement.side}${
    placement.align === 'center' ? '' : `-${placement.align}`
  }`;
}
