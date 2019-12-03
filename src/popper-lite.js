// @flow
import { popperGenerator } from './index';
import { popperOffsets, computeStyles, applyStyles } from './modifiers/index';

export default popperGenerator([popperOffsets, computeStyles, applyStyles]);
