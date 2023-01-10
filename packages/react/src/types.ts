import type {
  ComputePositionReturn,
  Middleware,
  Placement,
  Strategy,
  VirtualElement,
} from '@floating-ui/dom';
import type {UseFloatingReturn as UsePositionFloatingReturn} from '@floating-ui/react-dom';
import * as React from 'react';

import type {DismissPayload} from './hooks/useDismiss';

export * from '.';
export {Props as UseClickProps} from './hooks/useClick';
export {Props as UseDismissProps} from './hooks/useDismiss';
export {Props as UseFocusProps} from './hooks/useFocus';
export {Props as UseHoverProps} from './hooks/useHover';
export {Props as UseListNavigationProps} from './hooks/useListNavigation';
export {Props as UseRoleProps} from './hooks/useRole';
export {
  Props as UseTransitionStatusProps,
  UseTransitionStylesProps,
} from './hooks/useTransition';
export {Props as UseTypeaheadProps} from './hooks/useTypeahead';
export {InnerProps, UseInnerOffsetProps} from './inner';
export * from '@floating-ui/dom';
export {arrow} from '@floating-ui/react-dom';

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
  openEvent?: MouseEvent | PointerEvent | FocusEvent;
  typing?: boolean;
  [key: string]: any;
}

export interface FloatingContext<RT extends ReferenceType = ReferenceType>
  extends Omit<UsePositionFloatingReturn<RT>, 'refs' | 'elements'> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  events: FloatingEvents;
  dataRef: React.MutableRefObject<ContextData>;
  nodeId: string | undefined;
  refs: ExtendedRefs<RT>;
  elements: ExtendedElements<RT>;
}

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

export type UseFloatingData = Omit<ComputePositionReturn, 'x' | 'y'> & {
  x: number | null;
  y: number | null;
};

export type UseFloatingReturn<RT extends ReferenceType = ReferenceType> =
  UseFloatingData & {
    update: () => void;
    reference: (node: RT | null) => void;
    floating: (node: HTMLElement | null) => void;
    positionReference: (node: ReferenceType | null) => void;
    context: FloatingContext<RT>;
    refs: ExtendedRefs<RT>;
    elements: ExtendedElements<RT>;
    isPositioned: boolean;
  };

export interface UseFloatingProps<RT extends ReferenceType = ReferenceType> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placement: Placement;
  middleware: Array<Middleware | null | undefined | false>;
  strategy: Strategy;
  nodeId: string;
  whileElementsMounted?: (
    reference: RT,
    floating: HTMLElement,
    update: () => void
  ) => void | (() => void);
}
