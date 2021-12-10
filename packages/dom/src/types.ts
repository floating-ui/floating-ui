import type {
  Middleware,
  MiddlewareArguments,
  SideObject,
} from '@floating-ui/core';
import type {Options as DetectOverflowOptions} from '@floating-ui/core/src/detectOverflow';
import type {Options as AutoPlacementOptions} from '@floating-ui/core/src/middleware/autoPlacement';
import type {Options as SizeOptions} from '@floating-ui/core/src/middleware/size';
import type {Options as FlipOptions} from '@floating-ui/core/src/middleware/flip';
import type {Options as ShiftOptions} from '@floating-ui/core/src/middleware/shift';

export type NodeScroll = {
  scrollLeft: number;
  scrollTop: number;
};

export type DOMDetectOverflowOptions = Omit<
  DetectOverflowOptions,
  'boundary'
> & {
  boundary: 'clippingParents' | Element | Array<Element>;
};

declare const autoPlacement: (
  options?: AutoPlacementOptions & DOMDetectOverflowOptions
) => Middleware;

declare const shift: (
  options?: ShiftOptions & DOMDetectOverflowOptions
) => Middleware;

declare const flip: (
  options?: FlipOptions & DOMDetectOverflowOptions
) => Middleware;

declare const size: (
  options?: SizeOptions & DOMDetectOverflowOptions
) => Middleware;

declare const arrow: (options: {
  element: HTMLElement;
  padding: number | SideObject;
}) => Middleware;

declare const detectOverflow: (
  middlewareArguments: MiddlewareArguments,
  options?: Partial<DOMDetectOverflowOptions>
) => SideObject;

export {autoPlacement, shift, arrow, size, flip, detectOverflow};
export {hide, offset, limitShift} from '@floating-ui/core';
export {computePosition} from './';
export {getScrollParents} from './utils/getScrollParents';
