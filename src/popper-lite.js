// @flow
import { popperGenerator } from './index';
import { popperOffsets, computeStyles, applyStyles } from './modifiers/index';

const createPopper = popperGenerator({
  defaultModifiers: [popperOffsets, computeStyles, applyStyles],
});

export { createPopper, popperGenerator };
