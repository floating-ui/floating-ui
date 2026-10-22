import type * as React from 'react';
import {
  offset as baseOffset,
  shift as baseShift,
  limitShift as baseLimitShift,
  flip as baseFlip,
  size as baseSize,
  autoPlacement as baseAutoPlacement,
  hide as baseHide,
  inline as baseInline,
  type Middleware,
  type OffsetOptions,
  type ShiftOptions,
  type LimitShiftOptions,
  type FlipOptions,
  type SizeOptions,
  type AutoPlacementOptions,
  type HideOptions,
  type InlineOptions,
  type Derivable,
  type MiddlewareState,
  type Coords,
} from '@floating-ui/dom';
import {arrow as baseArrow, type ArrowOptions} from './arrow';

// Stores `deps` in `options` so that `useFloating` can compare them.
const reactive =
  <O, R extends object>(base: (options: O) => R) =>
  (options: O, deps?: React.DependencyList): R => ({
    ...base(options),
    options: [options, deps],
  });

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
export const offset: (
  options?: OffsetOptions,
  deps?: React.DependencyList,
) => Middleware = /* #__PURE__ */ reactive(baseOffset);

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
export const shift: (
  options?: ShiftOptions | Derivable<ShiftOptions>,
  deps?: React.DependencyList,
) => Middleware = /* #__PURE__ */ reactive(baseShift);

/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
export const limitShift: (
  options?: LimitShiftOptions | Derivable<LimitShiftOptions>,
  deps?: React.DependencyList,
) => {
  fn: (state: MiddlewareState) => Coords;
  options: any;
} = /* #__PURE__ */ reactive(baseLimitShift);

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
export const flip: (
  options?: FlipOptions | Derivable<FlipOptions>,
  deps?: React.DependencyList,
) => Middleware = /* #__PURE__ */ reactive(baseFlip);

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
export const size: (
  options?: SizeOptions | Derivable<SizeOptions>,
  deps?: React.DependencyList,
) => Middleware = /* #__PURE__ */ reactive(baseSize);

/**
 * Optimizes the visibility of the floating element by choosing the placement
 * that has the most space available automatically, without needing to specify a
 * preferred placement. Alternative to `flip`.
 * @see https://floating-ui.com/docs/autoPlacement
 */
export const autoPlacement: (
  options?: AutoPlacementOptions | Derivable<AutoPlacementOptions>,
  deps?: React.DependencyList,
) => Middleware = /* #__PURE__ */ reactive(baseAutoPlacement);

/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
export const hide: (
  options?: HideOptions | Derivable<HideOptions>,
  deps?: React.DependencyList,
) => Middleware = /* #__PURE__ */ reactive(baseHide);

/**
 * Provides improved positioning for inline reference elements that can span
 * over multiple lines, such as hyperlinks or range selections.
 * @see https://floating-ui.com/docs/inline
 */
export const inline: (
  options?: InlineOptions | Derivable<InlineOptions>,
  deps?: React.DependencyList,
) => Middleware = /* #__PURE__ */ reactive(baseInline);

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * This wraps the core `arrow` middleware to allow React refs as the element.
 * @see https://floating-ui.com/docs/arrow
 */
export const arrow: (
  options: ArrowOptions | Derivable<ArrowOptions>,
  deps?: React.DependencyList,
) => Middleware = /* #__PURE__ */ reactive(baseArrow);
