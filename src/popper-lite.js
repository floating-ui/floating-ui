// @flow
import { popperGenerator } from './index';

import eventListeners from './modifiers/eventListeners';
import popperOffsets from './modifiers/popperOffsets';
import computeStyles from './modifiers/computeStyles';
import applyStyles from './modifiers/applyStyles';

import detectOverflow from './utils/detectOverflow';

export type * from './types';

const defaultModifiers = [
  eventListeners,
  popperOffsets,
  computeStyles,
  applyStyles,
];

const createPopper = popperGenerator({ defaultModifiers });

// eslint-disable-next-line import/no-unused-modules
export { createPopper, popperGenerator, defaultModifiers, detectOverflow };
