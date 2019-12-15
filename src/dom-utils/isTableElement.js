// @flow
import getComputedStyle from './getComputedStyle';

export default (element: Element): boolean =>
  getComputedStyle(element).display.startsWith('table');
