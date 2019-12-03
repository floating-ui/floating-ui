// @flow
import { popperGenerator } from './index';
import * as modifiers from './modifiers/index';

type Modifiers$Values = $Values<typeof modifiers>;

const defaultModifiers: Array<Modifiers$Values> = (Object.values(
  modifiers
): any);
const createPopper = popperGenerator({ defaultModifiers });

export { createPopper, popperGenerator };
