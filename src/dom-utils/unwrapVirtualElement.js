// @flow
import type { VirtualElement } from '../types';
import { isElement } from './instanceOf';

export default (element: Element | VirtualElement): Element => {
  return isElement(element) ? element : element.contextElement;
};
