import {isElement} from '@floating-ui/utils/dom';

import type {VirtualElement} from '../types';

export function unwrapElement(element: Element | VirtualElement) {
  return !isElement(element) ? element.contextElement : element;
}
