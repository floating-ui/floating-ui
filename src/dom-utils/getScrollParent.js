// @flow
import getParentNode from './getParentNode';
import getComputedStyle from './getComputedStyle';

export default function getScrollParent(node: Node): Node {
  if (!node) {
    return document.body;
  }

  switch (node.nodeName.toUpperCase()) {
    case 'HTML':
    case 'BODY':
      return node.ownerDocument.body;
    case '#document':
      // Flow doesn't understand nodeName type refinement unfortunately
      return ((node: any): Document).body;
  }

  if (node instanceof HTMLElement) {
    // Firefox want us to check `-x` and `-y` variations as well
    const { overflow, overflowX, overflowY } = getComputedStyle(node);
    if (/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)) {
      return node;
    }
  }

  return getScrollParent(getParentNode(node));
}
