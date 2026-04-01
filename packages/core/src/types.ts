import type {
  Axis,
  ClientRectObject,
  Coords,
  Dimensions,
  ElementRects,
  Placement,
  Rect,
  SideObject,
  Strategy,
} from '@floating-ui/utils';
import type {detectOverflow} from './detectOverflow';

type Promisable<T> = T | Promise<T>;

/**
 * Function option to derive middleware options from state.
 */
export type Derivable<T> = (state: MiddlewareState) => T;

/**
 * Platform interface methods to work with the current platform.
 * @see https://floating-ui.com/docs/platform
 */
export interface Platform {
  // Required
  getElementRects: (args: {
    reference: ReferenceElement;
    floating: FloatingElement;
    strategy: Strategy;
  }) => Promisable<ElementRects>;
  getClippingRect: (args: {
    element: any;
    boundary: Boundary;
    rootBoundary: RootBoundary;
    strategy: Strategy;
  }) => Promisable<Rect>;
  getDimensions: (element: any) => Promisable<Dimensions>;

  // Optional
  convertOffsetParentRelativeRectToViewportRelativeRect?:
    | ((args: {
        elements?: Elements | undefined;
        rect: Rect;
        offsetParent: any;
        strategy: Strategy;
      }) => Promisable<Rect>)
    | undefined;
  getOffsetParent?: ((element: any) => Promisable<any>) | undefined;
  isElement?: ((value: any) => Promisable<boolean>) | undefined;
  getDocumentElement?: ((element: any) => Promisable<any>) | undefined;
  getClientRects?:
    | ((element: any) => Promisable<Array<ClientRectObject>>)
    | undefined;
  isRTL?: ((element: any) => Promisable<boolean>) | undefined;
  getScale?: ((element: any) => Promisable<{x: number; y: number}>) | undefined;
  detectOverflow?: typeof detectOverflow | undefined;
}

export interface MiddlewareData {
  [key: string]: any;
  arrow?:
    | (Partial<Coords> & {
        centerOffset: number;
        alignmentOffset?: number | undefined;
      })
    | undefined;
  autoPlacement?:
    | {
        index?: number | undefined;
        overflows: Array<{
          placement: Placement;
          overflows: Array<number>;
        }>;
      }
    | undefined;
  flip?:
    | {
        index?: number | undefined;
        overflows: Array<{
          placement: Placement;
          overflows: Array<number>;
        }>;
      }
    | undefined;
  hide?:
    | {
        referenceHidden?: boolean | undefined;
        escaped?: boolean;
        referenceHiddenOffsets?: SideObject;
        escapedOffsets?: SideObject;
      }
    | undefined;
  offset?: (Coords & {placement: Placement}) | undefined;
  shift?:
    | (Coords & {
        enabled: {[key in Axis]: boolean};
      })
    | undefined;
}

export interface ComputePositionConfig {
  /**
   * Object to interface with the current platform.
   */
  platform: Platform;
  /**
   * Where to place the floating element relative to the reference element.
   */
  placement?: Placement | undefined;
  /**
   * The strategy to use when positioning the floating element.
   */
  strategy?: Strategy | undefined;
  /**
   * Array of middleware objects to modify the positioning or provide data for
   * rendering.
   */
  middleware?: Array<Middleware | null | undefined | false> | undefined;
}

export interface ComputePositionReturn extends Coords {
  /**
   * The final chosen placement of the floating element.
   */
  placement: Placement;
  /**
   * The strategy used to position the floating element.
   */
  strategy: Strategy;
  /**
   * Object containing data returned from all middleware, keyed by their name.
   */
  middlewareData: MiddlewareData;
}

export type ComputePosition = (
  reference: unknown,
  floating: unknown,
  config: ComputePositionConfig,
) => Promise<ComputePositionReturn>;

export interface MiddlewareReturn extends Partial<Coords> {
  data?:
    | {
        [key: string]: any;
      }
    | undefined;
  reset?:
    | boolean
    | {
        placement?: Placement | undefined;
        rects?: boolean | ElementRects | undefined;
      }
    | undefined;
}

export type Middleware = {
  name: string;
  options?: any;
  fn: (state: MiddlewareState) => Promisable<MiddlewareReturn>;
};

export type ReferenceElement = any;
export type FloatingElement = any;

export interface Elements {
  reference: ReferenceElement;
  floating: FloatingElement;
}

export interface MiddlewareState extends Coords {
  initialPlacement: Placement;
  placement: Placement;
  strategy: Strategy;
  middlewareData: MiddlewareData;
  elements: Elements;
  rects: ElementRects;
  platform: {detectOverflow: typeof detectOverflow} & Platform;
}
/**
 * @deprecated use `MiddlewareState` instead.
 */
export type MiddlewareArguments = MiddlewareState;

export type Boundary = any;
export type RootBoundary = 'viewport' | 'document' | Rect;
export type ElementContext = 'reference' | 'floating';
