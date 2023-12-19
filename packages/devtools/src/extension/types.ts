import type {ReferenceElement} from '@floating-ui/dom';

import type {HTML_ELEMENT_REFERENCE} from './constants';

export type Serialized<T> = T extends (infer R)[]
  ? Serialized<R>[]
  : T extends (...args: any[]) => any
    ? never
    : T extends ReferenceElement
      ? ReferenceId
      : T extends object
        ? {[P in keyof T]: Serialized<T[P]>}
        : T;

export type ReferenceId = `${typeof HTML_ELEMENT_REFERENCE}:${ReturnType<
  typeof crypto.randomUUID
>}`;
