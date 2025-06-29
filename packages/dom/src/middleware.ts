import type {
  Coords,
  InlineOptions,
  LimitShiftOptions,
  SideObject,
} from '@floating-ui/core';
import {
  arrow as arrowCore,
  autoPlacement as autoPlacementCore,
  detectOverflow as detectOverflowCore,
  flip as flipCore,
  hide as hideCore,
  inline as inlineCore,
  limitShift as limitShiftCore,
  offset as offsetCore,
  shift as shiftCore,
  size as sizeCore,
} from '@floating-ui/core';
import type {
  ArrowOptions,
  AutoPlacementOptions,
  Derivable,
  DetectOverflowOptions,
  FlipOptions,
  HideOptions,
  Middleware,
  MiddlewareState,
  OffsetOptions,
  ShiftOptions,
  SizeOptions,
} from './types';

/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary on each side.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */
export function detectOverflow(
  state: MiddlewareState,
  options?: DetectOverflowOptions | Derivable<DetectOverflowOptions>,
): SideObject {
  const gen = detectOverflowCore(state, options);
  let step = gen.next();

  while (!step.done) {
    step = gen.next(step.value);
  }

  return step.value;
}

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `sideAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
export const offset: (
  options?: OffsetOptions | Derivable<OffsetOptions>,
) => Middleware = offsetCore as any;

/**
 * Optimizes the visibility of the floating element by choosing the placement
 * that has the most space available automatically, without needing to specify a
 * preferred placement. Alternative to `flip`.
 * @see https://floating-ui.com/docs/autoPlacement
 */
export const autoPlacement: (
  options?: AutoPlacementOptions | Derivable<AutoPlacementOptions>,
) => Middleware = autoPlacementCore as any;

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
export const shift: (
  options?: ShiftOptions | Derivable<ShiftOptions>,
) => Middleware = shiftCore as any;

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
export const flip: (
  options?: FlipOptions | Derivable<FlipOptions>,
) => Middleware = flipCore as any;

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
export const size: (
  options?: SizeOptions | Derivable<SizeOptions>,
) => Middleware = sizeCore as any;

/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
export const hide: (
  options?: HideOptions | Derivable<HideOptions>,
) => Middleware = hideCore as any;

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
export const arrow: (
  options: ArrowOptions | Derivable<ArrowOptions>,
) => Middleware = arrowCore as any;

/**
 * Provides improved positioning for inline reference elements that can span
 * over multiple lines, such as hyperlinks or range selections.
 * @see https://floating-ui.com/docs/inline
 */
export const inline: (
  options?: InlineOptions | Derivable<InlineOptions>,
) => Middleware = inlineCore as any;

/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
export const limitShift: (
  options?: LimitShiftOptions | Derivable<LimitShiftOptions>,
) => {
  options: any;
  fn: (state: MiddlewareState) => Coords;
} = limitShiftCore;
