// @flow
import Popper from './index';
import * as modifiers from './modifiers/index';

type Modifiers$Values = $Values<typeof modifiers>;

const defaultModifiers: Array<Modifiers$Values> = (Object.values(
  modifiers
): any);

Popper.defaultModifiers = defaultModifiers;

export default Popper;
