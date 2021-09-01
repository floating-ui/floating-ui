// @flow
/* eslint-disable import/no-unused-modules */
import type { Placement, ModifierPhases } from './enums';

import type { PopperOffsetsModifier } from './modifiers/popperOffsets';
import type { FlipModifier } from './modifiers/flip';
import type { HideModifier } from './modifiers/hide';
import type { OffsetModifier } from './modifiers/offset';
import type { EventListenersModifier } from './modifiers/eventListeners';
import type { ComputeStylesModifier } from './modifiers/computeStyles';
import type { ArrowModifier } from './modifiers/arrow';
import type { PreventOverflowModifier } from './modifiers/preventOverflow';
import type { ApplyStylesModifier } from './modifiers/applyStyles';

export type Obj = { [key: string]: any };

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

export type Offsets = {|
  y: number,
  x: number,
|};

export type PositioningStrategy = 'absolute' | 'fixed';

export type StateRects = {|
  reference: Rect,
  popper: Rect,
|};

export type StateOffsets = {|
  popper: Offsets,
  arrow?: Offsets,
|};

type OffsetData = { [Placement]: Offsets };

export type State = {|
  elements: {|
    reference: Element | VirtualElement,
    popper: HTMLElement,
    arrow?: HTMLElement,
  |},
  options: OptionsGeneric<any>,
  placement: Placement,
  strategy: PositioningStrategy,
  orderedModifiers: Array<Modifier<any, any>>,
  rects: StateRects,
  scrollParents: {|
    reference: Array<Element | Window | VisualViewport>,
    popper: Array<Element | Window | VisualViewport>,
  |},
  styles: {|
    [key: string]: $Shape<CSSStyleDeclaration>,
  |},
  attributes: {|
    [key: string]: { [key: string]: string | boolean },
  |},
  modifiersData: {
    arrow?: {
      x?: number,
      y?: number,
      centerOffset: number,
    },
    hide?: {
      isReferenceHidden: boolean,
      hasPopperEscaped: boolean,
      referenceClippingOffsets: SideObject,
      popperEscapeOffsets: SideObject,
    },
    offset?: OffsetData,
    preventOverflow?: Offsets,
    popperOffsets?: Offsets,
    [key: string]: any,
  },
  reset: boolean,
|};

type SetAction<S> = S | ((prev: S) => S);

export type Instance = {|
  state: State,
  destroy: () => void,
  forceUpdate: () => void,
  update: () => Promise<$Shape<State>>,
  setOptions: (
    setOptionsAction: SetAction<$Shape<OptionsGeneric<any>>>
  ) => Promise<$Shape<State>>,
|};

export type ModifierArguments<Options: Obj> = {
  state: State,
  instance: Instance,
  options: $Shape<Options>,
  name: string,
};
export type Modifier<Name, Options> = {|
  name: Name,
  enabled: boolean,
  phase: ModifierPhases,
  requires?: Array<string>,
  requiresIfExists?: Array<string>,
  fn: (ModifierArguments<Options>) => State | void,
  effect?: (ModifierArguments<Options>) => (() => void) | void,
  options?: $Shape<Options>,
  data?: Obj,
|};

export type StrictModifiers =
  | $Shape<OffsetModifier>
  | $Shape<ApplyStylesModifier>
  | $Shape<ArrowModifier>
  | $Shape<HideModifier>
  | $Shape<ComputeStylesModifier>
  | $Shape<EventListenersModifier>
  | $Shape<FlipModifier>
  | $Shape<PreventOverflowModifier>
  | $Shape<PopperOffsetsModifier>;

export type EventListeners = {| scroll: boolean, resize: boolean |};

export type Options = {|
  placement: Placement,
  modifiers: Array<$Shape<Modifier<any, any>>>,
  strategy: PositioningStrategy,
  onFirstUpdate?: ($Shape<State>) => void,
|};

export type OptionsGeneric<TModifier> = {|
  placement: Placement,
  modifiers: Array<TModifier>,
  strategy: PositioningStrategy,
  onFirstUpdate?: ($Shape<State>) => void,
|};

export type UpdateCallback = (State) => void;

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
  contextElement?: Element,
|};
