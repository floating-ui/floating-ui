// @flow
import getWindow from './getWindow';
import getNodeName from './getNodeName';
import isTableElement from './isTableElement';
import getTrueOffsetParent from './getTrueOffsetParent';

export default function getOffsetParent(element: Element) {
  const window = getWindow(element);
  let offsetParent = getTrueOffsetParent(element);

  // Find the nearest non-table offsetParent
  while (offsetParent && isTableElement(offsetParent)) {
    offsetParent = getTrueOffsetParent(offsetParent);
  }

  if (getNodeName(offsetParent) === 'body') {
    return window;
  }

  return offsetParent || window;
}
