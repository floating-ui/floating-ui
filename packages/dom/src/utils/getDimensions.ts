import type {Dimensions} from '@floating-ui/core';

import {getCssDimensions} from './getCssDimensions';

export function getDimensions(element: Element): Dimensions {
  return getCssDimensions(element);
}
