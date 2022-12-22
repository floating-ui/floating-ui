import type {VirtualElement} from '../types';
import {isElement} from './is';

export function unwrapElement(element: Element | VirtualElement) {
  return !isElement(element) ? element.contextElement : element;
}
