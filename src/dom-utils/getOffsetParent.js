// @flow
import getWindow from './getWindow';
import getNodeName from './getNodeName';
import getComputedStyle from './getComputedStyle';
import { isHTMLElement } from './instanceOf';
import isTableElement from './isTableElement';

const getTrueOffsetParent = (element: Element): ?Element =>
  isHTMLElement(element) ? element.offsetParent : null;

export default function getOffsetParent(element: Element) {
  const window = getWindow(element);

  let offsetParent = getTrueOffsetParent(element);

  // Find the nearest non-table offsetParent
  while (offsetParent && isTableElement(offsetParent)) {
    offsetParent = getTrueOffsetParent(offsetParent);
  }

  if (
    offsetParent &&
    getNodeName(offsetParent) === 'body' &&
    getComputedStyle(offsetParent).position === 'static'
  ) {
    return window;
  }

  return offsetParent || window;
}
