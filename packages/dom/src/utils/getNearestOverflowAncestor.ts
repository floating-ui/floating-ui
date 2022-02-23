import {getParentNode} from './getParentNode';
import {getNodeName} from './getNodeName';
import {isOverflowElement, isHTMLElement} from './is';

export function getNearestOverflowAncestor(node: Node): HTMLElement {
  if (['html', 'body', '#document'].includes(getNodeName(node))) {
    // @ts-ignore assume body is always available
    return node.ownerDocument.body;
  }

  if (isHTMLElement(node) && isOverflowElement(node)) {
    return node;
  }

  return getNearestOverflowAncestor(getParentNode(node));
}
