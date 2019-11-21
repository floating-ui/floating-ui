// @flow
import getParentNode from './getParentNode';
import getComputedStyle from './getComputedStyle';

export default function getScrollParent(node: Node): HTMLElement {
  if (!node) {
    return document.body;
  }

  if (['HTML', 'BODY', '#document'].includes(node.nodeName.toUpperCase())) {
    return node.ownerDocument.body;
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
