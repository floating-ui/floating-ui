// Type definitions for popper.js 1.10
// Project: https://github.com/FezVrasta/popper.js/
// Definitions by: ggray <https://github.com/giladgray>, rhysd <https://rhysd.github.io>, joscha <https://github.com/joscha>, seckardt <https://github.com/seckardt>, marcfallows <https://github.com/marcfallows>

// This file only declares the public portions of the API.
// It should not define internal pieces such as utils or modifier details.

declare module 'popper.js' {
  export type Position = 'top' | 'right' | 'bottom' | 'left';

  export type Placement = 'auto-start'
    | 'auto'
    | 'auto-end'
    | 'top-start'
    | 'top'
    | 'top-end'
    | 'right-start'
    | 'right'
    | 'right-end'
    | 'bottom-end'
    | 'bottom'
    | 'bottom-start'
    | 'left-end'
    | 'left'
    | 'left-start';

  export type Boundary = 'scrollParent' | 'viewport' | 'window';

  export type ModifierFn = (data: PopperData, options: Object) => PopperData;

  export interface BaseModifier {
    order?: number;
    enabled?: boolean;
    fn?: ModifierFn;
  }

  export interface Modifiers {
    shift?: BaseModifier;
    offset?: BaseModifier & {
      offset?: number | string,
    };
    preventOverflow?: BaseModifier & {
      priority?: Position[],
      padding?: number,
      boundariesElement?: Boundary | Element,
    };
    keepTogether?: BaseModifier;
    arrow?: BaseModifier & {
      element?: string | Element,
    };
    flip?: BaseModifier & {
      behavior?: 'flip' | 'clockwise' | 'counterclockwise' | Position[],
      padding?: number,
      boundariesElement?: Boundary | Element,
    };
    inner?: BaseModifier;
    hide?: BaseModifier;
    applyStyle?: BaseModifier & {
      onLoad?: Function,
      gpuAcceleration?: boolean,
    };
    [name: string]: BaseModifier & Record<string, any>;
  }

  export interface Offset {
    top: number;
    left: number;
    width: number;
    height: number;
  }

  export interface PopperData {
    instance: Popper;
    placement: Placement;
    originalPlacement: Placement;
    flipped: boolean;
    hide: boolean;
    arrowElement: Element;
    styles: CSSStyleDeclaration;
    boundaries: Object;
    offsets: {
      popper: Offset,
      reference: Offset,
      arrow: {
        top: number,
        left: number,
      },
    };
  }

  export interface PopperOptions {
    placement?: Placement;
    eventsEnabled?: boolean;
    modifiers?: Modifiers;
    removeOnDestroy?: boolean;
    onCreate?(data: PopperData): void;
    onUpdate?(data: PopperData): void;
  }

  export interface ReferenceObject {
    clientHeight: number;
    clientWidth: number;
    getBoundingClientRect(): ClientRect;
  }

  export default class Popper {
    static modifiers: (BaseModifier & { name: string })[];
    static placements: Placement[];
    static Defaults: PopperOptions;

    constructor(reference: Element | ReferenceObject, popper: Element, options?: PopperOptions);

    destroy(): void;
    update(): void;
    scheduleUpdate(): void;
    enableEventListeners(): void;
    disableEventListeners(): void;
  }
}
