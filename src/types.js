// @flow
/* eslint-disable import/no-unused-modules */
import type { Placement, ModifierPhases } from './enums';

import typeof ApplyStylesModifier from './modifiers/applyStyles';
import typeof ArrowModifier from './modifiers/arrow';
import typeof ComputeStylesModifier from './modifiers/computeStyles';
import typeof EventListenersModifier from './modifiers/eventListeners';
import typeof FlipModifier from './modifiers/flip';
import typeof HideModifier from './modifiers/hide';
import typeof OffsetModifier from './modifiers/offset';
import typeof PopperOffsetsModifier from './modifiers/popperOffsets';
import typeof PreventOverflowModifier from './modifiers/preventOverflow';

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
  orderedModifiers: Array<Modifier<any, any, any>>,
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
  modifiersData: $Shape<{
    [key: string]: any,
    arrow: $PropertyType<ArrowModifier, 'data'>,
    flip: $PropertyType<FlipModifier, 'data'>,
    popperOffsets: $PropertyType<PopperOffsetsModifier, 'data'>,
    offset: $PropertyType<OffsetModifier, 'data'>,
    preventOverflow: $PropertyType<PreventOverflowModifier, 'data'>,
  }>,
  reset: boolean,
|};

export type Instance = {|
  state: State,
  destroy: () => void,
  forceUpdate: () => void,
  update: () => Promise<$Shape<State>>,
  setOptions: (options: $Shape<Options>) => Promise<$Shape<State>>,
|};

export type ModifierArguments<Options: Obj, Name> = {
  state: State,
  instance: Instance,
  options: $Shape<Options>,
  name: Name,
};

export type Modifier<Name, Options = {||}, DataObj = {||}> = {|
  name: Name,
  enabled: boolean,
  phase: ModifierPhases,
  requires?: Array<string>,
  requiresIfExists?: Array<string>,
  fn: (ModifierArguments<Options, Name>) => State | void,
  effect?: (ModifierArguments<Options, Name>) => (() => void) | void,
  options?: $Shape<Options>,
  ...DataObj,
|};

export type OptionalModifier<M> = {
  ...$Shape<M>,
  name: $PropertyType<M, 'name'>,
};

export type Modifiers = Array<
  | OptionalModifier<ApplyStylesModifier>
  | OptionalModifier<HideModifier>
  | OptionalModifier<PopperOffsetsModifier>
  | OptionalModifier<PreventOverflowModifier>
  | OptionalModifier<ArrowModifier>
  | OptionalModifier<FlipModifier>
  | OptionalModifier<OffsetModifier>
  | OptionalModifier<ComputeStylesModifier>
  | OptionalModifier<EventListenersModifier>
  | $Shape<Modifier<string, any, any>>
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
