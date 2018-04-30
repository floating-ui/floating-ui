// @flow
import type { Placement } from './enums';
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

export type State = {
  reference?: Element,
  popper?: Element,
  options: Options,
  orderedModifiers: Array<Modifier>,
  measures: {
    reference?: Rect,
    popper?: Rect,
  },
  offsets: {
    popper?: Offsets,
  },
};

export type ModifierPhases =
  | 'read' // modifiers that need to read the DOM
  | 'main' // pure-logic modifiers
  | 'write'; // modifier with the purpose to write to the DOM (or write into a framework state)

export type Modifier = {
  name: string,
  enabled: boolean,
  phase: 'read' | 'write',
  requires?: Array<string>,
  fn: State => State,
  onLoad: State => void,
};

export type EventListeners = { scroll: boolean, resize: boolean };

export type Options = {
  placement: Placement,
  modifiers: Array<Modifier>,
  eventListeners: boolean | EventListeners,
};

export type UpdateCallback = State => void;
