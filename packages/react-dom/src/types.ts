import type {
  ComputePositionConfig,
  ComputePositionReturn,
  VirtualElement,
} from '@floating-ui/dom';
import * as React from 'react';

export {useFloating} from './';
export {arrow} from './';
export * from '@floating-ui/dom';

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
