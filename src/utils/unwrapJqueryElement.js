// @flow
import type { JQueryWrapper } from '../types';

export default function unwrapJqueryElement(
  element: HTMLElement | JQueryWrapper
): HTMLElement {
  // $FlowFixMe: need to get type refinement work
  return element.hasOwnProperty('jquery') ? element[0] : element;
}
