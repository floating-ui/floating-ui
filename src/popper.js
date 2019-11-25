// @flow
import Popper from './index';
import * as modifiers from './modifiers/index';

Popper.defaultModifiers = (Object.values(modifiers): any);
export default Popper;
