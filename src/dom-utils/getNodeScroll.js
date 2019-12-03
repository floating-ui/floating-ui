// @flow
import getWindowScroll from './getWindowScroll';
import getWindow from './getWindow';
import getHTMLElementScroll from './getHTMLElementScroll';

export default function getElementScroll(node: Node) {
  if (
    node === getWindow(node) ||
    !(node instanceof getWindow(node).HTMLElement)
  ) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}
