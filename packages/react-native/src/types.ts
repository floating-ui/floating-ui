import type {
  ComputePositionReturn,
  Middleware,
  Placement,
} from '@floating-ui/core';

export {useFloating} from './';
export type {
  AlignedPlacement,
  Alignment,
  Axis,
  ClientRectObject,
  ComputePositionConfig,
  ComputePositionReturn,
  Coords,
  Dimensions,
  ElementContext,
  ElementRects,
  Length,
  Middleware,
  MiddlewareArguments,
  MiddlewareData,
  MiddlewareReturn,
  MiddlewareState,
  Padding,
  Placement,
  Platform,
  Rect,
  RootBoundary,
  Side,
  SideObject,
  Strategy,
} from '@floating-ui/core';
export {
  arrow,
  autoPlacement,
  detectOverflow,
  flip,
  hide,
  inline,
  limitShift,
  offset,
  shift,
  size,
} from '@floating-ui/core';

export interface UseFloatingOptions {
  placement?: Placement;
  middleware?: Array<Middleware | null | undefined | false>;
  sameScrollView?: boolean;
  elements?: {
    reference?: any;
    floating?: any;
    offsetParent?: any;
  };
}

export interface UseFloatingReturn extends ComputePositionReturn {
  update: () => void;
  refs: {
    reference: React.MutableRefObject<any>;
    floating: React.MutableRefObject<any>;
    offsetParent: React.MutableRefObject<any>;
    setReference: (node: any) => void;
    setFloating: (node: any) => void;
    setOffsetParent: (node: any) => void;
  };
  elements: {
    reference: any;
    floating: any;
    offsetParent: any;
  };
  floatingStyles: {
    position: 'absolute';
    top: number;
    left: number;
  };
  scrollProps: {
    onScroll: (event: {
      nativeEvent: {
        contentOffset: {x: number; y: number};
      };
    }) => void;
    scrollEventThrottle: 16;
  };
}
