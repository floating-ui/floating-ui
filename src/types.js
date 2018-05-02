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
  reference: ?Element,
  popper: ?Element,
  options: Options,
  orderedModifiers: Array<Modifier>,
  measures: {
    reference?: Rect,
    popper?: Rect,
  },
  offsets: {
    popper?: Offsets,
  },
  scrollParents: {
    reference?: Array<Node>,
    popper?: Array<Node>,
  },
};

export type Modifier = {
  name: string,
  enabled: boolean,
  phase: 'read' | 'write',
  requires?: Array<string>,
  fn: State => State,
  onLoad: State => void,
  options: Object,
};

export type EventListeners = { scroll: boolean, resize: boolean };

export type Options = {
  placement: Placement,
  modifiers: Array<Modifier>,
  eventListeners: boolean | { scroll?: boolean, resize?: boolean },
};

export type UpdateCallback = State => void;
