// @flow
import type { JQueryWrapper } from '../types';

export default (element: HTMLElement | JQueryWrapper): HTMLElement =>
  // $FlowFixMe: need to get type refinement work
  element.hasOwnProperty('jquery') ? element[0] : element;
