import type {
  Middleware,
  MiddlewareArguments,
  SideObject,
} from '@floating-ui/core';
import type {Options as DetectOverflowOptions} from '@floating-ui/core/src/detectOverflow';
import type {Options as AdaptivePlacementOptions} from '@floating-ui/core/src/middleware/adaptivePlacement';
import type {Options as SizeOptions} from '@floating-ui/core/src/middleware/size';
import type {Options as ShiftOptions} from '@floating-ui/core/src/middleware/shift';

export type NodeScroll = {
  scrollLeft: number;
  scrollTop: number;
};

export type DOMDetectOverflowOptions = Omit<
  DetectOverflowOptions,
  'boundary'
> & {
  boundary: 'clippingParents' | Element | Array<Element>;
};

/**
 * Shifts the floating element in order to keep it in view when it will overflow
 * a clipping boundary.
 */
declare const shift: (
  options?: Partial<ShiftOptions & DOMDetectOverflowOptions>
) => Middleware;

/**
 * Changes the placement of the floating element when given a particular
 * strategy.
 */
declare const adaptivePlacement: (
  options?: Partial<AdaptivePlacementOptions & DOMDetectOverflowOptions>
) => Middleware;

/**
 * Provides data to change the size of the floating element. For instance,
 * prevent it from overflowing its clipping boundary or match the width of the
 * reference element.
 */
declare const size: (
  options?: Partial<SizeOptions & DOMDetectOverflowOptions>
) => Middleware;

/**
 * Positions an inner element of the floating element such that it is centered
 * to the reference element.
 */
declare const arrow: (options: {
  element: HTMLElement;
  padding?: number | SideObject;
}) => Middleware;

/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 */
declare const detectOverflow: (
  middlewareArguments: MiddlewareArguments,
  options?: Partial<DOMDetectOverflowOptions>
) => Promise<SideObject>;

export {adaptivePlacement, shift, arrow, size, detectOverflow};
export {
  hide,
  offset,
  limitShift,
  inline,
  fallback,
  bestFit,
} from '@floating-ui/core';
export type {
  Platform,
  Placement,
  Strategy,
  Middleware,
} from '@floating-ui/core';
export {computePosition} from './';
export {getScrollParents} from './utils/getScrollParents';
