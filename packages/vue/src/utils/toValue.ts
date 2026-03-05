import {unref} from 'vue';
import type {Ref} from 'vue';

type MaybeRef<T> = T | Ref<T>;
type MaybeRefOrGetter<T> = MaybeRef<T> | (() => T);

type AnyFn = (...args: any[]) => any;

export function toValue<T>(source: MaybeRefOrGetter<T>): T {
  return typeof source === 'function' ? (source as AnyFn)() : unref(source);
}
