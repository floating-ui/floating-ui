import type {
  UseFloatingOptions as UsePositionOptions,
  UseFloatingReturn as UsePositionFloatingReturn,
  VirtualElement,
} from '@floating-ui/react-dom';
import * as React from 'react';

import type {DismissPayload} from './hooks/useDismiss';

export * from '.';
export {FloatingArrowProps} from './components/FloatingArrow';
export {FloatingFocusManagerProps} from './components/FloatingFocusManager';
export {UseClickProps} from './hooks/useClick';
export {UseClientPointProps} from './hooks/useClientPoint';
export {UseDismissProps} from './hooks/useDismiss';
export {UseFocusProps} from './hooks/useFocus';
export {UseHoverProps} from './hooks/useHover';
export {UseListNavigationProps} from './hooks/useListNavigation';
export {UseRoleProps} from './hooks/useRole';
export {
  UseTransitionStatusProps,
  UseTransitionStylesProps,
} from './hooks/useTransition';
export {UseTypeaheadProps} from './hooks/useTypeahead';
export {InnerProps, UseInnerOffsetProps} from './inner';
export type {
  AlignedPlacement,
  Alignment,
  ArrowOptions,
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
} from '@floating-ui/react-dom';
export {
  arrow,
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
} from '@floating-ui/react-dom';

type Prettify<T> = {
  [K in keyof T]: T[K];
  // eslint-disable-next-line @typescript-eslint/ban-types
} & {};

export type NarrowedElement<T> = T extends Element ? T : Element;

export interface ExtendedRefs<RT> {
  reference: React.MutableRefObject<ReferenceType | null>;
  floating: React.MutableRefObject<HTMLElement | null>;
  domReference: React.MutableRefObject<NarrowedElement<RT> | null>;
  setReference: (node: RT | null) => void;
  setFloating: (node: HTMLElement | null) => void;
  setPositionReference: (node: ReferenceType | null) => void;
}

export interface ExtendedElements<RT> {
  reference: ReferenceType | null;
  floating: HTMLElement | null;
  domReference: NarrowedElement<RT> | null;
}

export interface FloatingEvents {
  emit<T extends string>(
    event: T,
    data?: T extends 'dismiss' ? DismissPayload : any
  ): void;
  on(event: string, handler: (data: any) => void): void;
  off(event: string, handler: (data: any) => void): void;
}

export interface ContextData {
  openEvent?: Event;
  /** @deprecated use `onTypingChange` prop in `useTypeahead` */
  typing?: boolean;
  [key: string]: any;
}

export type FloatingContext<RT extends ReferenceType = ReferenceType> = Omit<
  UsePositionFloatingReturn<RT>,
  'refs' | 'elements'
> & {
  open: boolean;
  onOpenChange: (open: boolean, event?: Event) => void;
  events: FloatingEvents;
  dataRef: React.MutableRefObject<ContextData>;
  nodeId: string | undefined;
  floatingId: string;
  refs: ExtendedRefs<RT>;
  elements: ExtendedElements<RT>;
};

export interface FloatingNodeType<RT extends ReferenceType = ReferenceType> {
  id: string;
  parentId: string | null;
  context?: FloatingContext<RT>;
}

export interface FloatingTreeType<RT extends ReferenceType = ReferenceType> {
  nodesRef: React.MutableRefObject<Array<FloatingNodeType<RT>>>;
  events: FloatingEvents;
  addNode: (node: FloatingNodeType) => void;
  removeNode: (node: FloatingNodeType) => void;
}

export interface ElementProps {
  reference?: React.HTMLProps<Element>;
  floating?: React.HTMLProps<HTMLElement>;
  item?: React.HTMLProps<HTMLElement>;
}

export type ReferenceType = Element | VirtualElement;

export type UseFloatingData = Prettify<UseFloatingReturn>;

export type UseFloatingReturn<RT extends ReferenceType = ReferenceType> =
  Prettify<
    UsePositionFloatingReturn & {
      context: Prettify<FloatingContext<RT>>;
      refs: ExtendedRefs<RT>;
      elements: ExtendedElements<RT>;
    }
  >;

export interface UseFloatingOptions<RT extends ReferenceType = ReferenceType>
  extends Omit<UsePositionOptions<RT>, 'elements'> {
  elements?: {
    reference?: Element | null;
    floating?: HTMLElement | null;
  };
  onOpenChange?: (open: boolean, event?: Event) => void;
  nodeId?: string;
}
