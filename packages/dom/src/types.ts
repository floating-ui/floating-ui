import type {
  ArrowOptions as CoreArrowOptions,
  AutoPlacementOptions as CoreAutoPlacementOptions,
  ClientRectObject,
  ComputePositionConfig as CoreComputePositionConfig,
  DetectOverflowOptions as CoreDetectOverflowOptions,
  Dimensions,
  ElementRects,
  FlipOptions as CoreFlipOptions,
  HideOptions as CoreHideOptions,
  Middleware as CoreMiddleware,
  MiddlewareReturn,
  MiddlewareState as CoreMiddlewareState,
  Rect,
  RootBoundary,
  ShiftOptions as CoreShiftOptions,
  SizeOptions as CoreSizeOptions,
  Strategy,
} from '@floating-ui/core';

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type Promisable<T> = T | Promise<T>;

export type Derivable<T> = (state: MiddlewareState) => T;

export type OffsetValue =
  | number
  | {
      /**
       * The axis that runs along the side of the floating element. Represents
       * the distance (gutter or margin) between the reference and floating
       * element.
       * @default 0
       */
      mainAxis?: number;
      /**
       * The axis that runs along the alignment of the floating element.
       * Represents the skidding between the reference and floating element.
       * @default 0
       */
      crossAxis?: number;
      /**
       * The same axis as `crossAxis` but applies only to aligned placements
       * and inverts the `end` alignment. When set to a number, it overrides the
       * `crossAxis` value.
       *
       * A positive number will move the floating element in the direction of
       * the opposite edge to the one that is aligned, while a negative number
       * the reverse.
       * @default null
       */
      alignmentAxis?: number | null;
    };
// `OffsetOptions` in the core library were originally already `Derivable`. For
// backwards-compatibility, re-define it here to use the DOM Derivable type.
export type OffsetOptions = OffsetValue | Derivable<OffsetValue>;

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
  convertOffsetParentRelativeRectToViewportRelativeRect: (args: {
    elements?: Elements;
    rect: Rect;
    offsetParent: Element;
    strategy: Strategy;
  }) => Promisable<Rect>;
  getOffsetParent: (
    element: Element,
    polyfill?: (element: HTMLElement) => Element | null,
  ) => Promisable<Element | Window>;
  isElement: (value: unknown) => Promisable<boolean>;
  getDocumentElement: (element: Element) => Promisable<HTMLElement>;
  getClientRects: (element: Element) => Promisable<Array<ClientRectObject>>;
  isRTL: (element: Element) => Promisable<boolean>;
  getScale: (element: HTMLElement) => Promisable<{x: number; y: number}>;
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
  getClientRects?(): Array<ClientRectObject> | DOMRectList;
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
        },
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
export type {AutoUpdateOptions} from './autoUpdate';
