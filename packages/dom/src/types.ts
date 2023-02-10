import type {
  AutoPlacementOptions,
  ClientRectObject,
  ComputePositionConfig as CoreComputePositionConfig,
  DetectOverflowOptions as CoreDetectOverflowOptions,
  Dimensions,
  ElementRects,
  FlipOptions,
  HideOptions,
  Middleware as CoreMiddleware,
  MiddlewareReturn,
  MiddlewareState as CoreMiddlewareState,
  Padding,
  Rect,
  RootBoundary,
  ShiftOptions,
  SideObject,
  SizeOptions as CoreSizeOptions,
  Strategy,
} from '@floating-ui/core';

type Prettify<T> = {
  [K in keyof T]: T[K];
  // eslint-disable-next-line @typescript-eslint/ban-types
} & {};

type Promisable<T> = T | Promise<T>;

export interface Platform {
  // Required
  getElementRects: (args: {
    reference: ReferenceElement;
    floating: FloatingElement;
    strategy: Strategy;
  }) => Promisable<ElementRects>;
  getClippingRect: (args: {
    element: Element;
    boundary: Boundary;
    rootBoundary: RootBoundary;
    strategy: Strategy;
  }) => Promisable<Rect>;
  getDimensions: (element: Element) => Promisable<Dimensions>;

  // Optional
  convertOffsetParentRelativeRectToViewportRelativeRect?: (args: {
    rect: Rect;
    offsetParent: Element;
    strategy: Strategy;
  }) => Promisable<Rect>;
  getOffsetParent?: (
    element: Element,
    polyfill?: (element: HTMLElement) => Element | null
  ) => Promisable<Element | Window>;
  isElement?: (value: unknown) => Promisable<boolean>;
  getDocumentElement?: (element: Element) => Promisable<HTMLElement>;
  getClientRects?: (element: Element) => Promisable<Array<ClientRectObject>>;
  isRTL?: (element: Element) => Promisable<boolean>;
  getScale?: (element: HTMLElement) => Promisable<{x: number; y: number}>;
}

export interface NodeScroll {
  scrollLeft: number;
  scrollTop: number;
}

/**
 * The clipping boundary area of the floating element.
 */
export type Boundary = 'clippingAncestors' | Element | Array<Element> | Rect;

export type DetectOverflowOptions = Prettify<
  Omit<CoreDetectOverflowOptions, 'boundary'> & {
    boundary: Boundary;
  }
>;

export type SizeOptions = Prettify<
  Omit<CoreSizeOptions, 'apply'> & {
    /**
     * Function that is called to perform style mutations to the floating element
     * to change its size.
     * @default undefined
     */
    apply(
      args: MiddlewareState & {
        availableWidth: number;
        availableHeight: number;
      }
    ): Promisable<void>;
  }
>;

export type ComputePositionConfig = Prettify<
  Omit<CoreComputePositionConfig, 'middleware' | 'platform'> & {
    middleware?: Array<Middleware | null | undefined | false>;
    platform?: Platform;
  }
>;

/**
 * Custom positioning reference element.
 * @see https://floating-ui.com/docs/virtual-elements
 */
export interface VirtualElement {
  getBoundingClientRect(): ClientRectObject;
  contextElement?: Element;
}

export type ReferenceElement = Element | VirtualElement;
export type FloatingElement = HTMLElement;

export interface Elements {
  reference: ReferenceElement;
  floating: FloatingElement;
}

export type MiddlewareState = Prettify<
  Omit<CoreMiddlewareState, 'elements'> & {
    elements: Elements;
  }
>;
/**
 * @deprecated use `MiddlewareState` instead.
 */
export type MiddlewareArguments = MiddlewareState;

export type Middleware = Prettify<
  Omit<CoreMiddleware, 'fn'> & {
    fn(state: MiddlewareState): Promisable<MiddlewareReturn>;
  }
>;

/**
 * Optimizes the visibility of the floating element by choosing the placement
 * that has the most space available automatically, without needing to specify a
 * preferred placement. Alternative to `flip`.
 * @see https://floating-ui.com/docs/autoPlacement
 */
declare const autoPlacement: (
  options?: Partial<AutoPlacementOptions & DetectOverflowOptions>
) => Middleware;

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
declare const shift: (
  options?: Partial<ShiftOptions & DetectOverflowOptions>
) => Middleware;

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
declare const flip: (
  options?: Partial<FlipOptions & DetectOverflowOptions>
) => Middleware;

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
declare const size: (
  options?: Partial<SizeOptions & DetectOverflowOptions>
) => Middleware;

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
declare const arrow: (options: {
  element: Element;
  padding?: Padding;
}) => Middleware;

/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
declare const hide: (
  options?: Partial<HideOptions & DetectOverflowOptions>
) => Middleware;

/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary on each side.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */
declare const detectOverflow: (
  state: MiddlewareState,
  options?: Partial<DetectOverflowOptions>
) => Promise<SideObject>;

export {arrow, autoPlacement, detectOverflow, flip, hide, shift, size};
export {computePosition} from './';
export {autoUpdate, Options as AutoUpdateOptions} from './autoUpdate';
export {platform} from './platform';
export {getOverflowAncestors} from './utils/getOverflowAncestors';
export type {
  AlignedPlacement,
  Alignment,
  ArrowOptions,
  AutoPlacementOptions,
  Axis,
  ClientRectObject,
  ComputePositionReturn,
  Coords,
  Dimensions,
  ElementContext,
  ElementRects,
  FlipOptions,
  HideOptions,
  InlineOptions,
  Length,
  MiddlewareData,
  MiddlewareReturn,
  OffsetOptions,
  Padding,
  Placement,
  Rect,
  RootBoundary,
  ShiftOptions,
  Side,
  SideObject,
  Strategy,
} from '@floating-ui/core';
export {inline, limitShift, offset} from '@floating-ui/core';
