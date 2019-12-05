// @flow
import getWindow from './getWindow';
import getNodeName from './getNodeName';
import { isHTMLElement } from './instanceOf';

export default function getOffsetParent(element: Element) {
  const offsetParent = isHTMLElement(element) ? element.offsetParent : null;
  const window = getWindow(element);

  if (getNodeName(offsetParent) === 'body') {
    return window;
  }

  return offsetParent || window;
}
