import * as React from 'react';
import type {
  ComputePositionReturn,
  VirtualElement,
  Placement,
  Middleware,
  Strategy,
} from '@floating-ui/dom';

export * from '@floating-ui/dom';
export * from './';

export {arrow} from '@floating-ui/react-dom';

export interface FloatingEvents {
  emit(event: string, data?: any): void;
  on(event: string, handler: (data?: any) => void): void;
  off(event: string, handler: (data?: any) => void): void;
}

export interface ContextData {
  openEvent?: MouseEvent | PointerEvent | FocusEvent;
  typing?: boolean;
  [key: string]: any;
}

export interface FloatingContext<RT extends ReferenceType = ReferenceType>
  extends UseFloatingReturn<RT> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  events: FloatingEvents;
  dataRef: React.MutableRefObject<ContextData>;
  nodeId: string | undefined;
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
    refs: {
      reference: React.MutableRefObject<RT | null>;
      floating: React.MutableRefObject<HTMLElement | null>;
    };
  };

export interface UseFloatingProps<RT extends ReferenceType = ReferenceType> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placement: Placement;
  middleware: Array<Middleware>;
  strategy: Strategy;
  nodeId: string;
  whileElementsMounted?: (
    reference: RT,
    floating: HTMLElement,
    update: () => void
  ) => void | (() => void);
}
