import type {Dimensions} from '@floating-ui/core';

import {getCssDimensions} from './getCssDimensions';

export function getDimensions(element: HTMLElement): Dimensions {
  return getCssDimensions(element);
}
