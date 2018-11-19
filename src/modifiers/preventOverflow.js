// @flow
import type { State } from '../types';

type Options = {
  bounaryElement: HTMLElement,
};

export function preventOverflow(state: State, options: ?Options) {}

export default {
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
};
