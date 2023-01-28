import type {Dimensions} from '@floating-ui/core';

import {getCssDimensions} from './getCssDimensions';
import {isHTMLElement} from './is';

export function getDimensions(element: Element): Dimensions {
  if (isHTMLElement(element)) {
    return getCssDimensions(element);
  }

  return element.getBoundingClientRect();
}
