import {isElement} from '../platform/isElement';
import type {VirtualElement} from '../types';

export function unwrapElement(element: Element | VirtualElement) {
  return !isElement(element) ? element.contextElement : element;
}
