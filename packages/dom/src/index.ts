import type {
  ComputePositionConfig,
  ReferenceElement,
  FloatingElement,
  VirtualElement,
} from './types';
import {computePosition as computePositionCore} from '@floating-ui/core';
import {platform} from './platform';
import {clippingAncestorsCache} from './utils/cache';

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
  // The HTML element can also be in the cache when using virtual reference
  // elements, but since it doesn't change for the given script, we can just
  // leave it in there.
  const possibleCachedElements = [reference, floating].concat(
    reference ? (reference as VirtualElement).contextElement || [] : []
  );

  const result = computePositionCore(reference, floating, {
    platform,
    ...options,
  });

  possibleCachedElements.forEach((el) => {
    clippingAncestorsCache.delete(el);
  });

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
