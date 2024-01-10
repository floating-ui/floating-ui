import type {ReferenceElement} from '@floating-ui/dom';

import type {SERIALIZED_DATA_CHANGE} from './utils/constants';
import type {ReferenceId} from './utils/references';

export type Serialized<T> = T extends (infer R)[]
  ? Serialized<R>[]
  : T extends (...args: any[]) => any
    ? never
    : T extends ReferenceElement
      ? ReferenceId
      : T extends object
        ? {[P in keyof T]: Serialized<T[P]>}
        : T;

export type SerializedDataChangeMessage = typeof SERIALIZED_DATA_CHANGE;
