// @flow

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
