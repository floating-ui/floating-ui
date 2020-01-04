// @flow
import getWindow from './getWindow';
import getNodeName from './getNodeName';
import getComputedStyle from './getComputedStyle';
import { isHTMLElement } from './instanceOf';
import isTableElement from './isTableElement';

// https://stackoverflow.com/a/9851769/2059996
const isFirefox = () => typeof window.InstallTrigger !== 'undefined';

function getTrueOffsetParent(element: Element): ?Element {
  let offsetParent;

  if (
    !isHTMLElement(element) ||
    !(offsetParent = element.offsetParent) ||
    // https://github.com/popperjs/popper.js/issues/837
    (isFirefox() && getComputedStyle(offsetParent).position === 'fixed')
  ) {
    return null;
  }

  return offsetParent;
}

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
