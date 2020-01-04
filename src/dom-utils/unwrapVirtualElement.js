// @flow
import type { VirtualElement } from '../types';
import { isElement } from './instanceOf';

export default function unwrapVirtualElement(
  element: Element | VirtualElement
): Element {
  return isElement(element) ? element : element.contextElement;
}
