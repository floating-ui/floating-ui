import type {ComponentPublicInstance} from 'vue-demi';

import type {MaybeElement} from '../types';

export function unwrapElement<T>(element: MaybeElement<T>) {
  return ((element as Exclude<MaybeElement<T>, T>)?.$el ?? element) as Exclude<
    MaybeElement<T>,
    ComponentPublicInstance
  >;
}
