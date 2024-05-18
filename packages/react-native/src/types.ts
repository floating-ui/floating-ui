import type {
  ComputePositionReturn,
  Middleware,
  Placement,
} from '@floating-ui/core';
import type * as React from 'react';

export type {
  AlignedPlacement,
  Alignment,
  ArrowOptions,
  AutoPlacementOptions,
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
  FlipOptions,
  FloatingElement,
  HideOptions,
  InlineOptions,
  Length,
  Middleware,
  MiddlewareArguments,
  MiddlewareData,
  MiddlewareReturn,
  MiddlewareState,
  OffsetOptions,
  Padding,
  Placement,
  Platform,
  Rect,
  ReferenceElement,
  RootBoundary,
  ShiftOptions,
  Side,
  SideObject,
  SizeOptions,
  Strategy,
  VirtualElement,
} from '@floating-ui/core';

export interface UseFloatingOptions {
  /**
   * Where to place the floating element relative to the reference element.
   */
  placement?: Placement;
  /**
   * Array of middleware objects to modify the positioning or provide data for
   * rendering.
   */
  middleware?: Array<Middleware | null | undefined | false>;
  sameScrollView?: boolean;
  elements?: {
    reference?: any;
    floating?: any;
    offsetParent?: any;
  };
}

export interface UseFloatingReturn extends ComputePositionReturn {
  /**
   * Update the position of the floating element, re-rendering the component
   * if required.
   */
  update: () => void;
  /**
   * Object containing the reference and floating refs and reactive setters.
   */
  refs: {
    /**
     * A React ref to the reference element.
     */
    reference: React.MutableRefObject<any>;
    /**
     * A React ref to the floating element.
     */
    floating: React.MutableRefObject<any>;
    offsetParent: React.MutableRefObject<any>;
    /**
     * A callback to set the reference element (reactive).
     */
    setReference: (node: any) => void;
    /**
     * A callback to set the floating element (reactive).
     */
    setFloating: (node: any) => void;
    setOffsetParent: (node: any) => void;
  };
  elements: {
    reference: any;
    floating: any;
    offsetParent: any;
  };
  /**
   * Pre-configured positioning styles to apply to the floating element.
   */
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
