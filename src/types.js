// @flow
export type JQueryWrapper = Element[] & { jquery: string };

export type State = {
  reference: ?Element,
  popper: ?Element,
  orderedModifiers: Array<Modifier>
};

export type Modifier = {
  name: string,
  enabled: boolean,
  phase: "read" | "write",
  requires?: Array<string>,
  fn: State => State,
  onLoad: State => void
};

export type Options = {
  modifiers: Array<Modifier>,
  eventsEnabled: boolean
};
