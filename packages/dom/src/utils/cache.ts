import type {FloatingElement, ReferenceElement} from '../types';

// This cache is in effect for a single `computePosition()` call.
export const clippingAncestorsCache = new WeakMap<
  ReferenceElement | FloatingElement,
  Array<Element>
>();
