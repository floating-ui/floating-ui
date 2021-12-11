export type BasePlacement = 'top' | 'right' | 'bottom' | 'left';
export type AlignedPlacement =
  | 'top-start'
  | 'top-end'
  | 'right-start'
  | 'right-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'left-start'
  | 'left-end';
export type Placement = BasePlacement | AlignedPlacement;
export type Strategy = 'absolute' | 'fixed';
export type Alignment = 'start' | 'end';
export type Axis = 'x' | 'y';
export type Length = 'width' | 'height';

export type Platform = {
  getElementRects: (args: {
    reference: ReferenceElement;
    floating: FloatingElement;
    strategy: Strategy;
  }) => ElementRects | Promise<ElementRects>;
  convertOffsetParentRelativeRectToViewportRelativeRect: (args: {
    rect: Rect;
    offsetParent: any;
    strategy: Strategy;
  }) => Rect | Promise<Rect>;
  getOffsetParent: (args: {element: any}) => any | Promise<any>;
  isElement: (value: unknown) => boolean | Promise<boolean>;
  getDocumentElement: (args: {element: any}) => any | Promise<any>;
  getClippingClientRect: (args: {
    element: any;
    boundary: Boundary;
    rootBoundary: RootBoundary;
  }) => ClientRectObject | Promise<ClientRectObject>;
  getDimensions: (args: {element: any}) => Dimensions | Promise<Dimensions>;
};

export type Coords = {
  x: number;
  y: number;
};

export type SideObject = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type MiddlewareData = {
  arrow?: {
    x?: number;
    y?: number;
    centerOffset: number;
  };
  autoPlacement?: {
    index?: number;
    skip?: boolean;
    overflows: Array<{
      placement: Placement;
      overflows: Array<number>;
    }>;
  };
  flip?: {
    index?: number;
    skip?: boolean;
    overflows: Array<{
      placement: Placement;
      overflows: Array<number>;
    }>;
  };
  hide?: {
    referenceHidden: boolean;
    escaped: boolean;
    referenceHiddenOffsets: SideObject;
    escapedOffsets: SideObject;
  };
  size?: {
    skip?: boolean;
  };
  offset?: Coords;
  [key: string]: any;
};

export type ComputePositionConfig = {
  platform: Platform;
  placement?: Placement;
  strategy?: Strategy;
  middleware?: Array<Middleware>;
};

export type ComputePositionReturn = {
  x: number;
  y: number;
  placement: Placement;
  strategy: Strategy;
  middlewareData: MiddlewareData;
};

export type ComputePosition = (
  reference: unknown,
  floating: unknown,
  config: ComputePositionConfig
) => Promise<ComputePositionReturn>;

export type MiddlewareReturn = Partial<
  Coords & {
    data: {
      [key: string]: any;
    };
    reset: true | {placement?: Placement};
  }
>;

export type Middleware = {
  name: string;
  fn: (
    middlewareArguments: MiddlewareArguments
  ) => MiddlewareReturn | Promise<MiddlewareReturn>;
};

export type Dimensions = {
  width: number;
  height: number;
};

export type Rect = Coords & Dimensions;

export type ElementRects = {
  reference: Rect;
  floating: Rect;
};

export type VirtualElement = {
  getBoundingClientRect(): ClientRectObject;
  contextElement?: any;
};
export type ReferenceElement = any;
export type FloatingElement = any;

export type Elements = {
  reference: ReferenceElement;
  floating: FloatingElement;
};

export type MiddlewareArguments = Coords & {
  initialPlacement: Placement;
  placement: Placement;
  strategy: Strategy;
  middlewareData: MiddlewareData;
  elements: Elements;
  rects: ElementRects;
  platform: Platform;
};

export type ClientRectObject = Rect & SideObject;
export type Padding = number | SideObject;
export type Boundary = any;
export type RootBoundary = 'viewport' | 'document';
export type ElementContext = 'reference' | 'floating';

export {computePosition} from './computePosition';
export {rectToClientRect} from './utils/rectToClientRect';
export {detectOverflow} from './detectOverflow';

export {arrow} from './middleware/arrow';
export {autoPlacement} from './middleware/autoPlacement';
export {flip} from './middleware/flip';
export {hide} from './middleware/hide';
export {offset} from './middleware/offset';
export {shift, limitShift} from './middleware/shift';
export {size} from './middleware/size';
