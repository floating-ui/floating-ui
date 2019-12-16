// @flow
import { popperGenerator } from './index';
import eventListeners from './modifiers/eventListeners';
import popperOffsets from './modifiers/popperOffsets';
import computeStyles from './modifiers/computeStyles';
import applyStyles from './modifiers/applyStyles';

const createPopper = popperGenerator({
  defaultModifiers: [eventListeners, popperOffsets, computeStyles, applyStyles],
});

// eslint-disable-next-line import/no-unused-modules
export { createPopper, popperGenerator };
