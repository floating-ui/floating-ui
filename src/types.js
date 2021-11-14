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
  placement: Placement,
  initialPlacement: Placement,
  rects: ElementRects,
  elements: Elements,
  coords: Coords,
  modifiersData: Obj,
  platform: Platform,
  strategy: PositioningStrategy,
  scheduleReset: ({|
    placement: Placement,
  |}) => void,
|};

export type VisualViewport = EventTarget & {
  width: number,
  height: number,
  offsetLeft: number,
  offsetTop: number,
  scale: number,
};

// This is a limited subset of the Window object, Flow doesn't provide one
// so we define our own, with just the properties we need
export type Window = {|
  innerHeight: number,
  offsetHeight: number,
  innerWidth: number,
  offsetWidth: number,
  pageXOffset: number,
  pageYOffset: number,
  getComputedStyle: typeof getComputedStyle,
  addEventListener(type: any, listener: any, optionsOrUseCapture?: any): void,
  removeEventListener(
    type: any,
    listener: any,
    optionsOrUseCapture?: any
  ): void,
  Element: Element,
  HTMLElement: HTMLElement,
  Node: Node,
  toString(): '[object Window]',
  devicePixelRatio: number,
  visualViewport?: VisualViewport,
  ShadowRoot: ShadowRoot,
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
  ) => {|
    ...Coords,
    data: Obj,
  |},
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
