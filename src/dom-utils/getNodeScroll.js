// @flow
import getWindowScroll from './getWindowScroll';
import getWindow from './getWindow';
import { isHTMLElement } from './instanceOf';
import getHTMLElementScroll from './getHTMLElementScroll';

export default function getNodeScroll(node: Node) {
  if (node === getWindow(node) || !isHTMLElement(node)) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}
