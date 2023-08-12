import type {
  ComputePositionConfig,
  ComputePositionReturn,
  Padding,
  VirtualElement,
} from '@floating-ui/dom';
import type {Accessor, JSX} from 'solid-js';

export * from '.';
export {arrow} from './arrow';
export {useFloating} from './useFloating';
export type {
  AlignedPlacement,
  Alignment,
  AutoPlacementOptions,
  AutoUpdateOptions,
  Axis,
  Boundary,
  ClientRectObject,
  ComputePositionConfig,
  ComputePositionReturn,
  Coords,
  DetectOverflowOptions,
  Dimensions,
  ElementContext,
  ElementRects,
  Elements,
  FlipOptions,
  FloatingElement,
  HideOptions,
  InlineOptions,
  Length,
  Middleware,
  MiddlewareArguments,
  MiddlewareData,
  MiddlewareReturn,
  MiddlewareState,
  NodeScroll,
  OffsetOptions,
  Padding,
  Placement,
  Platform,
  Rect,
  ReferenceElement,
  RootBoundary,
  ShiftOptions,
  Side,
  SideObject,
  SizeOptions,
  Strategy,
  VirtualElement,
} from '@floating-ui/dom';
export {
  autoPlacement,
  autoUpdate,
  computePosition,
  detectOverflow,
  flip,
  getOverflowAncestors,
  hide,
  inline,
  limitShift,
  offset,
  platform,
  shift,
  size,
} from '@floating-ui/dom';

type Prettify<T> = {
  [K in keyof T]: T[K];
  // eslint-disable-next-line @typescript-eslint/ban-types
} & {};

export type UseFloatingData = Prettify<
  ComputePositionReturn & {isPositioned: boolean}
>;

export type ReferenceType = Element | VirtualElement;

export type UseFloatingReturn<
  RT extends ReferenceType = ReferenceType,
  F = HTMLElement
> = Prettify<
  UseFloatingData & {
    /**
     * Update the position of the floating element, re-rendering the component
     * if required.
     */
    update: () => void;
    /**
     * Pre-configured positioning styles to apply to the floating element.
     */
    floatingStyles: JSX.CSSProperties;
    /**
     * Object containing the reference and floating refs and reactive setters.
     */

    elements: {
      reference?: RT | null;
      floating?: F | null;
    };
  }
>;

export type UseFloatingOptions<
  RT extends ReferenceType = ReferenceType,
  F = HTMLElement
> = Prettify<
  Partial<ComputePositionConfig> & {
    /**
     * A callback invoked when both the reference and floating elements are
     * mounted, and cleaned up when either is unmounted. This is useful for
     * setting up event listeners (e.g. pass `autoUpdate`).
     */
    whileElementsMounted?: (
      reference: RT,
      floating: F,
      update: () => void
    ) => () => void;
    elements?: {
      reference?: RT | null;
      floating?: F | null;
    };
    /**
     * The `open` state of the floating element to synchronize with the
     * `isPositioned` value.
     */
    open?: boolean;
    /**
     * Whether to use `transform` for positioning instead of `top` and `left`
     * (layout) in the `floatingStyles` object.
     */
    transform?: boolean;
  }
>;

export type ArrowOptions = {
  /**
   * The arrow element or template ref to be positioned.
   * @required
   */
  element: Accessor<HTMLElement | undefined>;
  /**
   * The padding between the arrow element and the floating element edges. Useful when the floating element has rounded corners.
   * @default 0
   */
  padding?: Padding;
};
