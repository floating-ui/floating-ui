import type {
  ComputePositionConfig as ComputePositionConfigDOM,
  ComputePositionReturn,
  Padding,
  ReferenceElement,
  VirtualElement,
} from '@floating-ui/dom';
import {MaybeAccessor} from '@solid-primitives/utils';
import type {Accessor, JSX} from 'solid-js';

import {DismissPayload} from './hooks/useDismiss';

type ComputePositionConfig = ComputePositionConfigDOM & {
  middleware?: MaybeAccessor<ComputePositionConfigDOM['middleware']>;
};

export {arrow} from './arrow';
export {useFloating} from './hooks/useFloating';
export type {
  AlignedPlacement,
  Alignment,
  AutoPlacementOptions,
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
  NodeScroll,
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

type Prettify<T> = {
  [K in keyof T]: T[K];
  // eslint-disable-next-line @typescript-eslint/ban-types
} & {};

export type UseFloatingData = Prettify<
  ComputePositionReturn & {isPositioned: boolean}
>;

export type ReferenceType = Element | VirtualElement;

export type UseFloatingReturn<R extends ReferenceType = ReferenceType> =
  Prettify<
    UseFloatingData & {
      /**
       * Update the position of the floating element, re-rendering the component
       * if required.
       */
      update: () => void;
      /**
       * Pre-configured positioning styles to apply to the floating element.
       */
      floatingStyles: JSX.CSSProperties;
      /**
       * Object containing the reference and floating refs and reactive setters.
       */
      refs: ExtendedRefs<R>;
      // {
      //   /**
      //    * A reactive reference element.
      //    */
      //   reference: Accessor<R | null>;
      //   /**
      //    * A reactive floating element.
      //    */
      //   floating: Accessor<F | null>;
      //   /**
      //    * A callback to set the reference element (reactive).
      //    */
      //   setReference: (node: R | null) => void;
      //   /**
      //    * A callback to set the floating element (reactive).
      //    */
      //   setFloating: (node: F | null) => void;
      // };
      context: Accessor<FloatingContext<R>>;
      elements: ExtendedElements<R>;
    }
  >;

export type UseFloatingOptions<R extends ReferenceType = ReferenceType> =
  Prettify<
    Partial<ComputePositionConfig> & {
      /**
       * A callback invoked when both the reference and floating elements are
       * mounted, and cleaned up when either is unmounted. This is useful for
       * setting up event listeners (e.g. pass `autoUpdate`).
       */
      whileElementsMounted?: (
        reference: ReferenceElement | R,
        floating: HTMLElement,
        update: () => void,
      ) => () => void;
      elements?: Partial<ExtendedPositionElements<R>>;
      /**
       * The `open` state of the floating element to synchronize with the
       * `isPositioned` value.
       */
      open?: MaybeAccessor<boolean>;
      /**
       * Whether to use `transform` for positioning instead of `top` and `left`
       * (layout) in the `floatingStyles` object.
       */
      transform?: boolean;
      onOpenChange?: (open: boolean, event?: Event) => void;
      nodeId?: string;
    }
  >;

export type ArrowOptions = {
  /**
   * The arrow element or template ref to be positioned.
   * @required
   */
  element: Accessor<HTMLElement | undefined>;
  /**
   * The padding between the arrow element and the floating element edges. Useful when the floating element has rounded corners.
   * @default 0
   */
  padding?: Padding;
};

export type NarrowedElement<T> = T extends Element ? T : Element;

export type ExtendedRefs<R> = {
  reference: Accessor<R | null>;
  floating: Accessor<HTMLElement | null>;
  domReference: NarrowedElement<R> | null;
  setReference: (node: R | null) => void;
  setFloating: (node: HTMLElement | null) => void;
  setPositionReference: (node: ReferenceType | null) => void;
};

export type ExtendedPositionRefs<R extends ReferenceType = ReferenceType> =
  Omit<ExtendedRefs<R>, 'domReference'>;

export interface ExtendedElements<R extends ReferenceType = ReferenceType> {
  reference: Accessor<R | null>;
  floating: Accessor<HTMLElement | null>;
  domReference: Accessor<NarrowedElement<R> | null>;
}
export type ExtendedPositionElements<R extends ReferenceType = ReferenceType> =
  Omit<ExtendedElements<R>, 'domReference'>;
export interface FloatingEvents {
  emit<T extends string>(
    event: T,
    data?: T extends 'dismiss' ? DismissPayload : any,
  ): void;
  on(event: string, handler: (data: any) => void): void;
  off(event: string, handler: (data: any) => void): void;
}

export interface ContextData {
  openEvent?: Event;
  [key: string]: any;
}

export type FloatingContext<R extends ReferenceType = ReferenceType> = Omit<
  UseFloatingReturn<R>,
  'elements' | 'context'
> & {
  open: Accessor<boolean>;
  onOpenChange: (open: boolean, event?: Event) => void;
  events: FloatingEvents;
  dataRef: ContextData; //React.MutableRefObject<ContextData>;
  nodeId: string | undefined;
  floatingId: string;
  refs: ExtendedRefs<R>;
  elements: ExtendedElements<R>;
};

export interface FloatingNodeType<R extends ReferenceType = ReferenceType> {
  id: string;
  parentId: string | null;
  context?: FloatingContext<R>;
}

export interface FloatingTreeType<R extends ReferenceType = ReferenceType> {
  nodesRef: Array<FloatingNodeType<R>>;
  events: FloatingEvents;
  addNode: (node: FloatingNodeType) => void;
  removeNode: (node: FloatingNodeType) => void;
}

export interface ElementProps {
  reference?: JSX.HTMLAttributes<Element>;
  floating?: JSX.HTMLAttributes<HTMLElement>;
  item?: JSX.HTMLAttributes<HTMLElement>;
}
