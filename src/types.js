// @flow
import type { Placement, ModifierPhases } from './enums';
export type JQueryWrapper = Element[] & { jquery: string };

export type Rect = {
  width: number,
  height: number,
  x: number,
  y: number,
};

export type Offsets = {
  y: number,
  x: number,
};

export type PositioningStrategy = 'absolute' | 'fixed';

export type StateMeasures = {
  reference: Rect,
  popper: Rect,
};

export type StateOffsets = {
  popper: Offsets,
  arrow?: Offsets,
};

export type State = {
  elements: {
    reference: HTMLElement,
    popper: HTMLElement,
  },
  options: Options,
  placement: Placement,
  strategy: PositioningStrategy,
  orderedModifiers: Array<Modifier>,
  measures: StateMeasures,
  offsets: StateOffsets,
  scrollParents: {
    reference: Array<Node>,
    popper: Array<Node>,
  },
  styles: {
    [string]: $Shape<CSSStyleDeclaration>,
  },
};

export type Modifier = {
  name: string,
  enabled: boolean,
  phase: ModifierPhases,
  requires?: Array<string>,
  fn: (State, options: ?Object) => State,
  onLoad?: State => void,
  options?: Object,
};

export type EventListeners = { scroll: boolean, resize: boolean };

export type Options = {
  placement: Placement,
  modifiers: Array<Modifier>,
  strategy: PositioningStrategy,
  eventListeners: boolean | { scroll?: boolean, resize?: boolean },
};

export type UpdateCallback = State => void;
