// @flow
import getWindow from './getWindow';
import getNodeName from './getNodeName';
import getComputedStyle from './getComputedStyle';
import { isHTMLElement } from './instanceOf';
import isTableElement from './isTableElement';

function getTrueOffsetParent(element: Element): ?Element {
  if (
    !isHTMLElement(element) ||
    // https://github.com/popperjs/popper-core/issues/837
    getComputedStyle(element).position === 'fixed'
  ) {
    return null;
  }

  return element.offsetParent;
}

// https://github.com/popperjs/popper-core/issues/1035
function findNearestTransformedParent(element) {
  const parent = element.parentElement;
  if (parent) {
    let elementComputedStyles = getComputedStyle(parent);
    return elementComputedStyles.willChange !== 'auto' || elementComputedStyles.transform !== 'none' ? parent : findNearestTransformedParent(parent);
  }
  return null
}

/*
get the closest ancestor positioned element. Handles some edge cases,
such as table ancestors and cross browser bugs.
*/
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

  return offsetParent || findNearestTransformedParent(element) || window;
}
