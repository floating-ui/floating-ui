// @flow
import Popper from './index';
import { computeStyles, applyStyles } from './modifiers/index';

Popper.defaultModifiers = [computeStyles, applyStyles];
export default Popper;
