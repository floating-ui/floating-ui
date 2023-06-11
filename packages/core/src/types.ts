export type Alignment = 'start' | 'end';
export type Side = 'top' | 'right' | 'bottom' | 'left';
export type AlignedPlacement = `${Side}-${Alignment}`;
export type Placement = Side | AlignedPlacement;
export type Strategy = 'absolute' | 'fixed';
export type Axis = 'x' | 'y';
export type Length = 'width' | 'height';

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
  convertOffsetParentRelativeRectToViewportRelativeRect?: (args: {
    rect: Rect;
    offsetParent: any;
    strategy: Strategy;
  }) => Promisable<Rect>;
  getOffsetParent?: (element: any) => Promisable<any>;
  isElement?: (value: any) => Promisable<boolean>;
  getDocumentElement?: (element: any) => Promisable<any>;
  getClientRects?: (element: any) => Promisable<Array<ClientRectObject>>;
  isRTL?: (element: any) => Promisable<boolean>;
  getScale?: (element: any) => Promisable<{x: number; y: number}>;
}

export type Coords = {[key in Axis]: number};

export type SideObject = {[key in Side]: number};

export interface MiddlewareData {
  [key: string]: any;
  arrow?: Partial<Coords> & {
    centerOffset: number;
  };
  autoPlacement?: {
    index?: number;
    overflows: Array<{
      placement: Placement;
      overflows: Array<number>;
    }>;
  };
  flip?: {
    index?: number;
    overflows: Array<{
      placement: Placement;
      overflows: Array<number>;
    }>;
  };
  hide?: {
    referenceHidden?: boolean;
    escaped?: boolean;
    referenceHiddenOffsets?: SideObject;
    escapedOffsets?: SideObject;
  };
  offset?: Coords;
  shift?: Coords;
}

export interface ComputePositionConfig {
  /**
   * Object to interface with the current platform.
   */
  platform: Platform;
  /**
   * Where to place the floating element relative to the reference element.
   */
  placement?: Placement;
  /**
   * The strategy to use when positioning the floating element.
   */
  strategy?: Strategy;
  /**
   * Array of middleware objects to modify the positioning or provide data for
   * rendering.
   */
  middleware?: Array<Middleware | null | undefined | false>;
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
  config: ComputePositionConfig
) => Promise<ComputePositionReturn>;

export interface MiddlewareReturn extends Partial<Coords> {
  data?: {
    [key: string]: any;
  };
  reset?:
    | true
    | {
        placement?: Placement;
        rects?: true | ElementRects;
      };
}

export type Middleware = {
  name: string;
  options?: any;
  fn: (state: MiddlewareState) => Promisable<MiddlewareReturn>;
};

export type Dimensions = {[key in Length]: number};

export type Rect = Coords & Dimensions;

export interface ElementRects {
  reference: Rect;
  floating: Rect;
}

/**
 * Custom positioning reference element.
 * @see https://floating-ui.com/docs/virtual-elements
 */
export type VirtualElement = {
  getBoundingClientRect(): ClientRectObject;
  contextElement?: any;
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
  platform: Platform;
}
/**
 * @deprecated use `MiddlewareState` instead.
 */
export type MiddlewareArguments = MiddlewareState;

export type ClientRectObject = Rect & SideObject;
export type Padding = number | Partial<SideObject>;
export type Boundary = any;
export type RootBoundary = 'viewport' | 'document' | Rect;
export type ElementContext = 'reference' | 'floating';

export {computePosition} from './computePosition';
export {
  detectOverflow,
  Options as DetectOverflowOptions,
} from './detectOverflow';
export {arrow, ArrowOptions} from './middleware/arrow';
export {autoPlacement, AutoPlacementOptions} from './middleware/autoPlacement';
export {flip, FlipOptions} from './middleware/flip';
export {hide, HideOptions} from './middleware/hide';
export {inline, InlineOptions} from './middleware/inline';
export {offset, OffsetOptions} from './middleware/offset';
export {
  limitShift,
  LimitShiftOptions,
  shift,
  ShiftOptions,
} from './middleware/shift';
export {size, SizeOptions} from './middleware/size';
export {rectToClientRect} from './utils/rectToClientRect';
