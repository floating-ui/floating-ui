export type Alignment = 'start' | 'end';
export type BasePlacement = 'top' | 'right' | 'bottom' | 'left';
export type AlignedPlacement = `${BasePlacement}-${Alignment}`;
export type Placement = BasePlacement | AlignedPlacement;
export type Strategy = 'absolute' | 'fixed';
export type Axis = 'x' | 'y';
export type Length = 'width' | 'height';

type Promisable<T> = T | Promise<T>;

export type Platform = {
  getElementRects: (args: {
    reference: ReferenceElement;
    floating: FloatingElement;
    strategy: Strategy;
  }) => Promisable<ElementRects>;
  convertOffsetParentRelativeRectToViewportRelativeRect: (args: {
    rect: Rect;
    offsetParent: any;
    strategy: Strategy;
  }) => Promisable<Rect>;
  getOffsetParent: (args: {element: any}) => Promisable<any>;
  isElement: (value: unknown) => Promisable<boolean>;
  getDocumentElement: (args: {element: any}) => Promisable<any>;
  getClippingClientRect: (args: {
    element: any;
    boundary: Boundary;
    rootBoundary: RootBoundary;
  }) => Promisable<ClientRectObject>;
  getDimensions: (args: {element: any}) => Promisable<Dimensions>;
  getClientRects?: (args: {
    element: any;
  }) => Promisable<Array<ClientRectObject>>;
  isRTL?: (reference: ReferenceElement) => Promisable<boolean>;
};

export type Coords = {[key in Axis]: number};

export type SideObject = {[key in BasePlacement]: number};

export type MiddlewareData = {
  arrow?: Partial<Coords> & {
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
  inline?: {
    skip?: boolean;
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

export type ComputePositionReturn = Coords & {
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
    reset: true | {placement?: Placement; rects?: true | ElementRects};
  }
>;

export type Middleware = {
  name: string;
  options?: any;
  fn: (
    middlewareArguments: MiddlewareArguments
  ) => Promisable<MiddlewareReturn>;
};

export type Dimensions = {[key in Length]: number};

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
export {inline} from './middleware/inline';
