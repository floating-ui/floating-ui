import type {
  ArrowOptions as CoreArrowOptions,
  AutoPlacementOptions as CoreAutoPlacementOptions,
  ClientRectObject,
  ComputePositionConfig as CoreComputePositionConfig,
  Coords,
  DetectOverflowOptions as CoreDetectOverflowOptions,
  Dimensions,
  ElementRects,
  FlipOptions as CoreFlipOptions,
  HideOptions as CoreHideOptions,
  InlineOptions,
  LimitShiftOptions,
  Middleware as CoreMiddleware,
  MiddlewareReturn,
  MiddlewareState as CoreMiddlewareState,
  Rect,
  RootBoundary,
  ShiftOptions as CoreShiftOptions,
  SideObject,
  SizeOptions as CoreSizeOptions,
  Strategy,
} from '@floating-ui/core';

type Prettify<T> = {
  [K in keyof T]: T[K];
  // eslint-disable-next-line @typescript-eslint/ban-types
} & {};

type Promisable<T> = T | Promise<T>;

export type Derivable<T> = (state: MiddlewareState) => T;

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
    boundary?: Boundary;
  }
>;

export type ComputePositionConfig = Prettify<
  Omit<CoreComputePositionConfig, 'middleware' | 'platform'> & {
    /**
     * Array of middleware objects to modify the positioning or provide data for
     * rendering.
     */
    middleware?: Array<Middleware | null | undefined | false>;
    /**
     * Custom or extended platform object.
     */
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

export type SizeOptions = Prettify<
  Omit<CoreSizeOptions, 'apply' | 'boundary'> &
    DetectOverflowOptions & {
      /**
       * Function that is called to perform style mutations to the floating element
       * to change its size.
       * @default undefined
       */
      apply?(
        args: MiddlewareState & {
          availableWidth: number;
          availableHeight: number;
        }
      ): Promisable<void>;
    }
>;
export type ArrowOptions = Prettify<
  Omit<CoreArrowOptions, 'element'> & {
    element: Element;
  }
>;
export type AutoPlacementOptions = Prettify<
  Omit<CoreAutoPlacementOptions, 'boundary'> & DetectOverflowOptions
>;
export type ShiftOptions = Prettify<
  Omit<CoreShiftOptions, 'boundary'> & DetectOverflowOptions
>;
export type FlipOptions = Prettify<
  Omit<CoreFlipOptions, 'boundary'> & DetectOverflowOptions
>;
export type HideOptions = Prettify<
  Omit<CoreHideOptions, 'boundary'> & DetectOverflowOptions
>;

/**
 * Optimizes the visibility of the floating element by choosing the placement
 * that has the most space available automatically, without needing to specify a
 * preferred placement. Alternative to `flip`.
 * @see https://floating-ui.com/docs/autoPlacement
 */
declare const autoPlacement: (
  options?: AutoPlacementOptions | Derivable<AutoPlacementOptions>
) => Middleware;

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
declare const shift: (
  options?: ShiftOptions | Derivable<ShiftOptions>
) => Middleware;

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
declare const flip: (
  options?: FlipOptions | Derivable<FlipOptions>
) => Middleware;

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
declare const size: (
  options?: SizeOptions | Derivable<SizeOptions>
) => Middleware;

/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
declare const hide: (
  options?: HideOptions | Derivable<HideOptions>
) => Middleware;

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
declare const arrow: (
  options: ArrowOptions | Derivable<ArrowOptions>
) => Middleware;

/**
 * Provides improved positioning for inline reference elements that can span
 * over multiple lines, such as hyperlinks or range selections.
 * @see https://floating-ui.com/docs/inline
 */
declare const inline: (
  options?: InlineOptions | Derivable<InlineOptions>
) => Middleware;

/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
declare const limitShift: (
  options?: LimitShiftOptions | Derivable<LimitShiftOptions>
) => {
  options: any;
  fn: (state: MiddlewareState) => Coords;
};

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
  options?: DetectOverflowOptions
) => Promise<SideObject>;

export {
  arrow,
  autoPlacement,
  detectOverflow,
  flip,
  hide,
  inline,
  limitShift,
  shift,
  size,
};
export {computePosition} from './';
export {autoUpdate, AutoUpdateOptions} from './autoUpdate';
export {platform} from './platform';
export type {
  AlignedPlacement,
  Alignment,
  Axis,
  ClientRectObject,
  ComputePositionReturn,
  Coords,
  Dimensions,
  ElementContext,
  ElementRects,
  InlineOptions,
  Length,
  MiddlewareData,
  MiddlewareReturn,
  OffsetOptions,
  Padding,
  Placement,
  Rect,
  RootBoundary,
  Side,
  SideObject,
  Strategy,
} from '@floating-ui/core';
export {offset} from '@floating-ui/core';
export {getOverflowAncestors} from '@floating-ui/utils/dom';
