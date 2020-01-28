// @flow
import getParentNode from './getParentNode';
import getComputedStyle from './getComputedStyle';
import getNodeName from './getNodeName';
import { isHTMLElement } from './instanceOf';

export default function getScrollParent(node: Node): HTMLElement {
  if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
    // $FlowFixMe: assume body is always available
    return node.ownerDocument.body;
  }

  if (isHTMLElement(node)) {
    // Firefox wants us to check `-x` and `-y` variations as well
    const { overflow, overflowX, overflowY } = getComputedStyle(node);

    if (/auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX)) {
      return node;
    }
  }

  return getScrollParent(getParentNode(node));
}
