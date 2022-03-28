import type {
  Middleware as CoreMiddleware,
  SideObject,
  ClientRectObject,
  Padding,
  ElementRects,
  Strategy,
  RootBoundary,
  Rect,
  Dimensions,
  MiddlewareArguments as CoreMiddlewareArguments,
  MiddlewareReturn,
} from '@floating-ui/core';
import type {Options as CoreDetectOverflowOptions} from '@floating-ui/core/src/detectOverflow';
import type {Options as AutoPlacementOptions} from '@floating-ui/core/src/middleware/autoPlacement';
import type {Options as SizeOptions} from '@floating-ui/core/src/middleware/size';
import type {Options as FlipOptions} from '@floating-ui/core/src/middleware/flip';
import type {Options as ShiftOptions} from '@floating-ui/core/src/middleware/shift';
import type {Options as HideOptions} from '@floating-ui/core/src/middleware/hide';

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
  getOffsetParent?: (element: Element) => Promisable<Element | Window>;
  isElement?: (value: unknown) => Promisable<boolean>;
  getDocumentElement?: (element: Element) => Promisable<HTMLElement>;
  getClientRects?: (element: Element) => Promisable<Array<ClientRectObject>>;
  isRTL?: (element: Element) => Promisable<boolean>;
}

export interface NodeScroll {
  scrollLeft: number;
  scrollTop: number;
}

export type Boundary = 'clippingAncestors' | Element | Array<Element>;

export type DetectOverflowOptions = Omit<
  CoreDetectOverflowOptions,
  'boundary'
> & {
  boundary: Boundary;
};

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

export type MiddlewareArguments = Omit<CoreMiddlewareArguments, 'elements'> & {
  elements: Elements;
};

export type Middleware = Omit<CoreMiddleware, 'fn'> & {
  fn(args: MiddlewareArguments): Promisable<MiddlewareReturn>;
};

/**
 * Automatically chooses the `placement` which has the most space available.
 * @see https://floating-ui.com/docs/autoPlacement
 */
declare const autoPlacement: (
  options?: Partial<AutoPlacementOptions & DetectOverflowOptions>
) => Middleware;

/**
 * Shifts the floating element in order to keep it in view when it will overflow
 * a clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
declare const shift: (
  options?: Partial<ShiftOptions & DetectOverflowOptions>
) => Middleware;

/**
 * Changes the placement of the floating element to one that will fit if the
 * initially specified `placement` does not.
 * @see https://floating-ui.com/docs/flip
 */
declare const flip: (
  options?: Partial<FlipOptions & DetectOverflowOptions>
) => Middleware;

/**
 * Provides data to change the size of the floating element. For instance,
 * prevent it from overflowing its clipping boundary or match the width of the
 * reference element.
 * @see https://floating-ui.com/docs/size
 */
declare const size: (
  options?: Partial<SizeOptions & DetectOverflowOptions>
) => Middleware;

/**
 * Positions an inner element of the floating element such that it is centered
 * to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
declare const arrow: (options: {
  element: HTMLElement;
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
 * element is overflowing a given clipping boundary.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */
declare const detectOverflow: (
  middlewareArguments: MiddlewareArguments,
  options?: Partial<DetectOverflowOptions>
) => Promise<SideObject>;

export {autoPlacement, shift, arrow, size, flip, hide, detectOverflow};
export {offset, limitShift, inline} from '@floating-ui/core';
export type {
  Placement,
  Strategy,
  Alignment,
  Side,
  AlignedPlacement,
  Axis,
  Length,
  Coords,
  SideObject,
  Dimensions,
  Rect,
  ElementRects,
  ElementContext,
  ClientRectObject,
  Padding,
  RootBoundary,
  MiddlewareReturn,
  MiddlewareData,
  ComputePositionConfig,
  ComputePositionReturn,
} from '@floating-ui/core';

export {computePosition} from './';
export {autoUpdate} from './autoUpdate';

export {getOverflowAncestors} from './utils/getOverflowAncestors';
