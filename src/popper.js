// @flow
import { popperGenerator } from './index';
import { viewport } from './enums';
import eventListeners from './modifiers/eventListeners';
import popperOffsets from './modifiers/popperOffsets';
import detectOverflow from './modifiers/detectOverflow';
import computeStyles from './modifiers/computeStyles';
import applyStyles from './modifiers/applyStyles';
import offset from './modifiers/offset';
import flip from './modifiers/flip';
import preventOverflow from './modifiers/preventOverflow';
import arrow from './modifiers/arrow';

const defaultModifiers = [
  eventListeners,
  popperOffsets,
  {
    ...detectOverflow,
    name: 'detectOverflow:preventOverflow',
  },
  {
    ...detectOverflow,
    name: 'detectOverflow:flip',
    options: { rootArea: viewport },
  },
  computeStyles,
  applyStyles,
  offset,
  flip,
  preventOverflow,
  arrow,
];

const createPopper = popperGenerator({ defaultModifiers });

// eslint-disable-next-line import/no-unused-modules
export { createPopper, popperGenerator };
