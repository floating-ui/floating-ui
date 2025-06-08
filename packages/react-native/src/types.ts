import type {
  ComputePositionReturn,
  Middleware as CoreMiddleware,
  Placement,
  Platform as CorePlatform,
  MiddlewareState,
  MiddlewareReturn,
  ElementRects,
  Rect,
  Dimensions,
  Boundary,
  RootBoundary,
  Strategy,
  Elements,
  ClientRectObject,
} from '@floating-ui/core';
import type * as React from 'react';

// Type overrides to make core types async for React Native
export interface Platform
  extends Omit<
    CorePlatform,
    | 'getElementRects'
    | 'getClippingRect'
    | 'getDimensions'
    | 'convertOffsetParentRelativeRectToViewportRelativeRect'
    | 'getOffsetParent'
    | 'isElement'
    | 'getDocumentElement'
    | 'getClientRects'
    | 'isRTL'
    | 'getScale'
  > {
  getElementRects: (args: {
    reference: any;
    floating: any;
    strategy: Strategy;
  }) => Promise<ElementRects>;
  getClippingRect: (args: {
    element: any;
    boundary: Boundary;
    rootBoundary: RootBoundary;
    strategy: Strategy;
  }) => Promise<Rect>;
  getDimensions: (element: any) => Promise<Dimensions>;
  convertOffsetParentRelativeRectToViewportRelativeRect?: (args: {
    elements?: Elements;
    rect: Rect;
    offsetParent: any;
    strategy: Strategy;
  }) => Promise<Rect>;
  getOffsetParent?: (element: any) => Promise<any>;
  isElement?: (value: any) => Promise<boolean>;
  getDocumentElement?: (element: any) => Promise<any>;
  getClientRects?: (element: any) => ClientRectObject;
  isRTL?: (element: any) => Promise<boolean>;
  getScale?: (element: any) => Promise<{
    x: number;
    y: number;
  }>;
}

export interface Middleware extends Omit<CoreMiddleware, 'fn'> {
  fn: (state: MiddlewareState) => Promise<MiddlewareReturn>;
}

export interface ComputePositionConfig {
  /**
   * Object to interface with the current platform.
   */
  platform: Platform;
  /**
   * Where to place the floating element relative to the reference element.
   */
  placement?: Placement;
  /**
   * The strategy to use when positioning the floating element.
   */
  strategy?: Strategy;
  /**
   * Array of middleware objects to modify the positioning or provide data for
   * rendering.
   */
  middleware?: Array<Middleware | null | undefined | false>;
}

export type {
  AlignedPlacement,
  Alignment,
  ArrowOptions,
  AutoPlacementOptions,
  Axis,
  Boundary,
  ClientRectObject,
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
  MiddlewareArguments,
  MiddlewareData,
  MiddlewareReturn,
  MiddlewareState,
  OffsetOptions,
  Padding,
  Placement,
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
