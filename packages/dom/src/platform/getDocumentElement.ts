import {isNode} from '../utils/node';

export function getDocumentElement(node: Node | Window): HTMLElement {
  return (
    (isNode(node) ? node.ownerDocument : node.document) || window.document
  ).documentElement;
}
