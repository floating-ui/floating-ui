// @flow
import Popper from './index';
import { popperOffsets, computeStyles, applyStyles } from './modifiers/index';

Popper.defaultModifiers = [popperOffsets, computeStyles, applyStyles];
export default Popper;
