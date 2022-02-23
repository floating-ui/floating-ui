import type {
  Middleware,
  MiddlewareArguments,
  SideObject,
} from '@floating-ui/core';
import type {Options as DetectOverflowOptions} from '@floating-ui/core/src/detectOverflow';
import type {Options as AutoPlacementOptions} from '@floating-ui/core/src/middleware/autoPlacement';
import type {Options as SizeOptions} from '@floating-ui/core/src/middleware/size';
import type {Options as FlipOptions} from '@floating-ui/core/src/middleware/flip';
import type {Options as ShiftOptions} from '@floating-ui/core/src/middleware/shift';

export type NodeScroll = {
  scrollLeft: number;
  scrollTop: number;
};

export type DOMDetectOverflowOptions = Omit<
  DetectOverflowOptions,
  'boundary'
> & {
  boundary: 'clippingAncestors' | Element | Array<Element>;
};

/**
 * Automatically chooses the `placement` which has the most space available.
 */
declare const autoPlacement: (
  options?: Partial<AutoPlacementOptions & DOMDetectOverflowOptions>
) => Middleware;

/**
 * Shifts the floating element in order to keep it in view when it will overflow
 * a clipping boundary.
 */
declare const shift: (
  options?: Partial<ShiftOptions & DOMDetectOverflowOptions>
) => Middleware;

/**
 * Changes the placement of the floating element to one that will fit if the
 * initially specified `placement` does not.
 */
declare const flip: (
  options?: Partial<FlipOptions & DOMDetectOverflowOptions>
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

export {autoPlacement, shift, arrow, size, flip, detectOverflow};
export {hide, offset, limitShift, inline} from '@floating-ui/core';
export type {
  Platform,
  Placement,
  Strategy,
  Middleware,
} from '@floating-ui/core';
export {computePosition} from './';
export {autoUpdate} from './autoUpdate';
export {getOverflowAncestors} from './utils/getOverflowAncestors';
