import {getParentNode} from './getParentNode';
import {getNodeName} from './getNodeName';
import {isScrollParent, isHTMLElement} from './is';

export function getScrollParent(node: Node): HTMLElement {
  if (['html', 'body', '#document'].includes(getNodeName(node))) {
    // @ts-ignore assume body is always available
    return node.ownerDocument.body;
  }

  if (isHTMLElement(node) && isScrollParent(node)) {
    return node;
  }

  return getScrollParent(getParentNode(node));
}
