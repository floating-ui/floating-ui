import type {
  ComputePositionConfig,
  ComputePositionReturn,
  VirtualElement,
} from '@floating-ui/dom';
import * as React from 'react';

export {arrow} from './arrow';
export {useFloating} from './useFloating';
export type {
  AlignedPlacement,
  Alignment,
  AutoUpdateOptions,
  Axis,
  Boundary,
  ClientRectObject,
  ComputePositionConfig,
  ComputePositionReturn,
  Coords,
  DetectOverflowOptions,
  Dimensions,
  ElementContext,
  ElementRects,
  Elements,
  FloatingElement,
  Length,
  Middleware,
  MiddlewareArguments,
  MiddlewareData,
  MiddlewareReturn,
  NodeScroll,
  Padding,
  Placement,
  Platform,
  Rect,
  ReferenceElement,
  RootBoundary,
  Side,
  SideObject,
  SizeOptions,
  Strategy,
  VirtualElement,
} from '@floating-ui/dom';
export {
  autoPlacement,
  autoUpdate,
  computePosition,
  detectOverflow,
  flip,
  getOverflowAncestors,
  hide,
  inline,
  limitShift,
  offset,
  platform,
  shift,
  size,
} from '@floating-ui/dom';

export type UseFloatingData = Omit<ComputePositionReturn, 'x' | 'y'> & {
  x: number | null;
  y: number | null;
  isPositioned: boolean;
};

export type ReferenceType = Element | VirtualElement;

export type UseFloatingReturn<RT extends ReferenceType = ReferenceType> =
  UseFloatingData & {
    update: () => void;
    reference: (node: RT | null) => void;
    floating: (node: HTMLElement | null) => void;
    refs: {
      reference: React.MutableRefObject<RT | null>;
      floating: React.MutableRefObject<HTMLElement | null>;
      setReference: (node: RT | null) => void;
      setFloating: (node: HTMLElement | null) => void;
    };
    elements: {
      reference: RT | null;
      floating: HTMLElement | null;
    };
  };

export type UseFloatingProps<RT extends ReferenceType = ReferenceType> = Omit<
  Partial<ComputePositionConfig>,
  'platform'
> & {
  whileElementsMounted?: (
    reference: RT,
    floating: HTMLElement,
    update: () => void
  ) => void | (() => void);
  open?: boolean;
};
