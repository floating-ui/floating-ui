import type {Coords} from '@floating-ui/core';
import type {FloatingElement, ReferenceElement} from '../types';

// This caches calls to expensive functions for a single `computePosition()`
// call. This is especially useful with `flip()` or other middleware that
// cause multiple resets and lifecycle re-runs.
// Note: we could also cache for the lifetime of a particular DOM node, but
// the user would have to opt-in to that, and there's likely no need for it.
export const cache = new Map<
  ReferenceElement | FloatingElement,
  Partial<{
    // Minifying these for bundle size reasons.
    a: Array<Element>; // clippingAncestors
    b: Coords; // scale
  }>
>();
