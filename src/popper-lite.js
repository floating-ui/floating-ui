// @flow
import { popperGenerator } from './index';
import {
  eventListeners,
  popperOffsets,
  computeStyles,
  applyStyles,
} from './modifiers/index';

const createPopper = popperGenerator({
  defaultModifiers: [eventListeners, popperOffsets, computeStyles, applyStyles],
});

export { createPopper, popperGenerator };
