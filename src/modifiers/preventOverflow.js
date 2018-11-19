// @flow
import type { State } from '../types';

type Options = {
  bounaryElement: HTMLElement,
};

export function preventOverflow(state: State, options: ?Options) {
  return state;
}

export default {
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
};
