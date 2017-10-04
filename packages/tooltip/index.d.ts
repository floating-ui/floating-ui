// Type definitions for tooltip.js 1.1.5
// Project: https://github.com/FezVrasta/popper.js/
// Definitions by: elebetsamer <https://github.com/elebetsamer>

// This file only declares the public portions of the API.
// It should not define internal pieces such as utils or modifier details.

/// <reference types="jquery"/>
/// <reference types="popper.js"/>

declare namespace Tooltip {
  export type Placement = 'top-start'
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

  export interface TooltipOptions {
    placement?: Placement | ((tooltip: Element, reference: Element) => string);
    container?: Element | string | false;
    delay?: number | TooltipDelayOptions;
    html?: boolean;
    title?: Element | string | (() => string);
    template?: string;
    trigger?: string;
    boundariesElement?: Element;
    offset: number | string;
    popperOptions: Popper.PopperOptions;
  }

  export interface TooltipDelayOptions {
    show: number;
    hide: number;
  }
}

declare class Tooltip {
  constructor(reference: Element | JQuery, options?: Tooltip.TooltipOptions);

  show(): void;
  hide(): void;
  dispose(): void;
  toggle(): void;
}

declare module 'tooltip.js' {
  export default Tooltip;
}
