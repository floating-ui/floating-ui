import * as React from 'react';
import type {
  ComputePositionReturn,
  ComputePositionConfig,
  VirtualElement,
} from '@floating-ui/dom';

export * from '@floating-ui/dom';

export {useFloating} from './';
export {arrow} from './';

export type UseFloatingData = Omit<ComputePositionReturn, 'x' | 'y'> & {
  x: number | null;
  y: number | null;
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
};
