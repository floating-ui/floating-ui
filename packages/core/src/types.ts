export type Alignment = 'start' | 'end';
export type Side = 'top' | 'right' | 'bottom' | 'left';
export type AlignedPlacement = `${Side}-${Alignment}`;
export type Placement = Side | AlignedPlacement;
export type Strategy = 'absolute' | 'fixed';
export type Axis = 'x' | 'y';
export type Length = 'width' | 'height';

type Promisable<T> = T | Promise<T>;

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
  platform: Platform;
  placement?: Placement;
  strategy?: Strategy;
  middleware?: Array<Middleware>;
}

export interface ComputePositionReturn extends Coords {
  placement: Placement;
  strategy: Strategy;
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
  fn: (
    middlewareArguments: MiddlewareArguments
  ) => Promisable<MiddlewareReturn>;
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

export interface MiddlewareArguments extends Coords {
  initialPlacement: Placement;
  placement: Placement;
  strategy: Strategy;
  middlewareData: MiddlewareData;
  elements: Elements;
  rects: ElementRects;
  platform: Platform;
}

export type ClientRectObject = Rect & SideObject;
export type Padding = number | SideObject;
export type Boundary = any;
export type RootBoundary = 'viewport' | 'document';
export type ElementContext = 'reference' | 'floating';

export {computePosition} from './computePosition';
export {rectToClientRect} from './utils/rectToClientRect';
export {detectOverflow, Options as DetectOverflowOptions} from './detectOverflow';

export {arrow, Options as ArrowOptions} from './middleware/arrow';
export {autoPlacement, Options as AutoPlacementOptions} from './middleware/autoPlacement';
export {flip, Options as FlipOptions} from './middleware/flip';
export {hide, Options as HideOptions} from './middleware/hide';
export {offset, Options as OffsetOptions} from './middleware/offset';
export {shift, limitShift, Options as ShiftOptions, LimitShiftOptions} from './middleware/shift';
export {size, Options as SizeOptions} from './middleware/size';
export {inline, Options as InlineOptions} from './middleware/inline';
