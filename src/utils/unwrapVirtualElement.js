// @flow
import type { VirtualElement } from '../types';

export default (element: Element | VirtualElement): Element =>
  element.hasOwnProperty('contextElement')
    ? // $FlowFixMe - type refinement needed
      element.contextElement
    : // $FlowFixMe
      element;
