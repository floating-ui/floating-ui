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
  OffsetOptions as CoreOffsetOptions,
  Rect,
  RootBoundary,
  ShiftOptions as CoreShiftOptions,
  SizeOptions as CoreSizeOptions,
  Strategy,
} from '@floating-ui/core';

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type Generatable<T> = T | Promise<T> | Generator<any, T, any>;

export type Derivable<T> = (state: MiddlewareState) => T;

export interface Platform {
  // Required
  getElementRects: (args: {
    reference: ReferenceElement;
    floating: FloatingElement;
    strategy: Strategy;
  }) => ElementRects;
  getClippingRect: (args: {
    element: Element;
    boundary: Boundary;
    rootBoundary: RootBoundary;
    strategy: Strategy;
  }) => Rect;
  getDimensions: (element: Element) => Dimensions;

  // Optional
  convertToViewportRelativeRect: (args: {
    elements?: Elements;
    rect: Rect;
    offsetParent: Element;
    strategy: Strategy;
  }) => Rect;
  getOffsetParent: (
    element: Element,
    polyfill?: (element: HTMLElement) => Element | null,
  ) => Element | Window;
  isElement: (value: unknown) => boolean;
  getDocumentElement: (element: Element) => HTMLElement;
  getClientRects: (element: Element) => Array<ClientRectObject>;
  isRTL: (element: Element) => boolean;
  getScale: (element: HTMLElement) => {x: number; y: number};
}

export interface NodeScroll {
  scrollLeft: number;
  scrollTop: number;
}

/**
 * The clipping boundary area of the floating element.
 */
export type Boundary = 'clipping-ancestors' | Element | Array<Element> | Rect;

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

export type Middleware = Prettify<
  Omit<CoreMiddleware, 'fn'> & {
    fn(state: MiddlewareState): MiddlewareReturn;
  }
>;

export type OffsetOptions = CoreOffsetOptions | Derivable<CoreOffsetOptions>;

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
      ): void;
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
