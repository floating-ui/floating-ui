// @flow
import type { VirtualElement } from '../types';
import getWindow from './getWindow';

export default (element: Element | VirtualElement): Element => {
  return element instanceof getWindow(element).Element
    ? element
    : // $FlowFixMe: type refinement not working
      element.contextElement;
};
