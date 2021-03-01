// @flow
import { popperGenerator, detectOverflow } from './createPopper';

import eventListeners from './modifiers/eventListeners';
import popperOffsets from './modifiers/popperOffsets';
import computeStyles from './modifiers/computeStyles';
import applyStyles from './modifiers/applyStyles';

/*:: export type * from './types'; */
/*;; export * from './types'; */

const defaultModifiers = [
  eventListeners,
  popperOffsets,
  computeStyles,
  applyStyles,
];

const createPopper = popperGenerator({ defaultModifiers });

// eslint-disable-next-line import/no-unused-modules
export { createPopper, popperGenerator, defaultModifiers, detectOverflow };
