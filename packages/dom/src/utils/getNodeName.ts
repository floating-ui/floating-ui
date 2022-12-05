import {isNode} from './is';

export function getNodeName(node: Node | Window): string {
  return isNode(node) ? (node.nodeName || '').toLowerCase() : '';
}
