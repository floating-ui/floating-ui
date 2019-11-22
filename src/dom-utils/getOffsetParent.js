// @flow
import getWindow from './getWindow';
import getNodeName from './getNodeName';

export default function getOffsetParent(element: Element) {
  const offsetParent =
    element instanceof HTMLElement ? element.offsetParent : null;
  const window = getWindow(element);

  if (getNodeName(offsetParent) === 'BODY') {
    return window;
  }

  return offsetParent || window;
}
