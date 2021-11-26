// @flow
/* eslint-disable import/no-unused-modules */
import type { Placement, RootBoundary } from './enums';

export type Obj = {
  [key: string]: any,
};

export type Reference = Obj;
export type Popper = Obj;

export type Coords = {|
  x: number,
  y: number,
|};

export type PositionConfig = {|
  platform: Platform,
  placement?: Placement,
  strategy?: PositioningStrategy,
  modifiers?: Array<Modifier>,
|};

export type ModifiersData = {
  arrow?: {|
    x?: number,
    y?: number,
    centerOffset: number,
  |},
  autoPlacement?: {|
    skip?: boolean,
    index?: number,
    overflows?: Array<{
      placement: Placement,
      overflows: [number] | [number, number, number],
    }>,
  |},
  flip?: {|
    skip?: boolean,
    index?: number,
    overflows?: Array<{|
      placement: Placement,
      overflows: [number] | [number, number, number],
    |}>,
  |},
  hide?: {|
    isReferenceHidden: boolean,
    hasPopperEscaped: boolean,
    referenceClippingOffsets: SideObject,
    popperEscapeOffsets: SideObject,
  |},
  offset?: {|
    x: number,
    y: number,
  |},
  size?: {|
    width: number,
    height: number,
  |},
};

export type ComputePositionReturn = {|
  ...Coords,
  placement: Placement,
  strategy: PositioningStrategy,
  modifiersData: ModifiersData,
|};

export type ComputePosition = (
  reference: Reference,
  popper: Popper,
  config: PositionConfig
) => Promise<ComputePositionReturn>;

export type Platform = {|
  isElement: (value: any) => Promise<boolean>,
  getElementRects: ({
    reference: any,
    popper: any,
    strategy: PositioningStrategy,
  }) => Promise<ElementRects>,
  getClippingClientRect: ({
    element: any,
    boundary: any,
    rootBoundary: RootBoundary,
  }) => Promise<ClientRectObject>,
  convertOffsetParentRelativeRectToViewportRelativeRect: ({
    rect: Rect,
    offsetParent: any,
    strategy: PositioningStrategy,
  }) => Promise<Rect>,
  getOffsetParent: ({ element: any }) => Promise<any>,
  getDocumentElement: ({ element: any }) => Promise<any>,
  getDimensions: ({ element: any }) => Promise<Dimensions>,
|};

export type ModifierArguments = {|
  ...Coords,
  placement: Placement,
  initialPlacement: Placement,
  rects: ElementRects,
  elements: Elements,
  modifiersData: ModifiersData,
  platform: Platform,
  strategy: PositioningStrategy,
  scheduleReset: ({|
    placement: Placement,
  |}) => void,
|};

export type Rect = {|
  width: number,
  height: number,
  x: number,
  y: number,
|};

export type Dimensions = {|
  width: number,
  height: number,
|};

export type PositioningStrategy = 'absolute' | 'fixed';

export type Elements = {|
  popper: Popper,
  reference: Reference,
|};

export type ElementRects = {|
  reference: Rect,
  popper: Rect,
|};

export type Modifier = {
  name: string,
  fn: (
    modifierArguments: ModifierArguments
  ) =>
    | $Shape<{| ...Coords, data: Obj |}>
    | Promise<$Shape<{| ...Coords, data: Obj |}>>,
};

export type ClientRectObject = {|
  x: number,
  y: number,
  top: number,
  left: number,
  right: number,
  bottom: number,
  width: number,
  height: number,
|};

export type SideObject = {|
  top: number,
  left: number,
  right: number,
  bottom: number,
|};

export type Padding = number | $Shape<SideObject>;

export type VirtualElement = {|
  getBoundingClientRect: () => ClientRect | DOMRect,
  contextElement?: Obj,
|};
