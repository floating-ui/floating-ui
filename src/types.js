// @flow
/* eslint-disable import/no-unused-modules */
import type { Placement, ModifierPhases } from './enums';
import type { Options as PreventOverflowOptions } from './modifiers/preventOverflow';
import type { Options as ArrowOptions } from './modifiers/arrow';
import type { Options as FlipOptions } from './modifiers/flip';
import type { Options as OffsetOptions } from './modifiers/offset';
import type { Options as ComputeStylesOptions } from './modifiers/computeStyles';
import type { Options as EventListenersOptions } from './modifiers/eventListeners';

export type Obj = { [key: string]: any };

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

export type State = {|
  elements: {|
    reference: Element | VirtualElement,
    popper: HTMLElement,
    arrow?: HTMLElement,
  |},
  options: Options,
  placement: Placement,
  strategy: PositioningStrategy,
  orderedModifiers: Array<Modifier<any>>,
  rects: StateRects,
  scrollParents: {|
    reference: Array<Element>,
    popper: Array<Element>,
  |},
  styles: {|
    [key: string]: $Shape<CSSStyleDeclaration>,
  |},
  attributes: {|
    [key: string]: { [key: string]: string | boolean },
  |},
  modifiersData: { [key: string]: any },
  reset: boolean,
|};

export type Instance = {|
  state: State,
  destroy: () => void,
  forceUpdate: () => void,
  update: () => Promise<$Shape<State>>,
  setOptions: (options: $Shape<Options>) => Promise<$Shape<State>>,
|};

export type ModifierArguments<Options: Obj> = {
  state: State,
  instance: Instance,
  options: $Shape<Options>,
  name: string,
};
export type Modifier<Options> = {|
  name: string,
  enabled: boolean,
  phase: ModifierPhases,
  requires?: Array<string>,
  requiresIfExists?: Array<string>,
  fn: (ModifierArguments<Options>) => State | void,
  effect?: (ModifierArguments<Options>) => (() => void) | void,
  options?: $Shape<Options>,
  data?: Obj,
|};

export type PreventOverflowModifier = Modifier<PreventOverflowOptions> & {|
  name: 'preventOverflow',
|};
export type ArrowModifier = Modifier<ArrowOptions> & {|
  name: 'arrow',
|};
export type EventListenersModifier = Modifier<EventListenersOptions> & {|
  name: 'eventListeners',
|};
export type FlipModifier = Modifier<FlipOptions> & {|
  name: 'flip',
|};
export type OffsetModifier = Modifier<OffsetOptions> & {|
  name: 'offset',
|};
export type ComputeStylesModifier = Modifier<ComputeStylesOptions> & {|
  name: 'computeStyles',
|};

export type Modifiers = Array<
  | $Shape<PreventOverflowModifier>
  | $Shape<ArrowModifier>
  | $Shape<FlipModifier>
  | $Shape<OffsetModifier>
  | $Shape<ComputeStylesModifier>
  | $Shape<EventListenersModifier>
  | $Shape<Modifier<any>>
>;

export type Options = {|
  placement: Placement,
  modifiers: Modifiers,
  strategy: PositioningStrategy,
  onFirstUpdate?: ($Shape<State>) => void,
|};

export type UpdateCallback = State => void;

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
|};
