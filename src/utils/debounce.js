// @flow
import type { State } from '../types';

export default function debounce(fn: Function) {
  let pending;
  return () => {
    if (!pending) {
      pending = new Promise<State>(resolve => {
        Promise.resolve().then(() => {
          pending = undefined;
          resolve(fn());
        });
      });
    }

    return pending;
  };
}
