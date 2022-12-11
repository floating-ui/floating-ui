import type {
  ComputePositionConfig,
  ReferenceElement,
  FloatingElement,
} from './types';
import {computePosition as computePositionCore} from '@floating-ui/core';
import {platform} from './platform';
import {cache} from './utils/cache';

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a reference element when it is given a certain CSS positioning
 * strategy.
 */
export const computePosition = (
  reference: ReferenceElement,
  floating: FloatingElement,
  options?: Partial<ComputePositionConfig>
) => {
  const result = computePositionCore(reference, floating, {
    platform,
    ...options,
  });

  cache.delete(reference);
  cache.delete(floating);

  return result;
};

export {
  arrow,
  autoPlacement,
  flip,
  hide,
  offset,
  shift,
  limitShift,
  size,
  inline,
  detectOverflow,
} from '@floating-ui/core';

export {autoUpdate} from './autoUpdate';

export {getOverflowAncestors} from './utils/getOverflowAncestors';

export {platform} from './platform';
