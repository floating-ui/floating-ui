import {getWindow} from './getWindow';

export function isNode(value: any): value is Node {
  return value instanceof getWindow(value).Node;
}

export function getNodeName(node: Node | Window): string {
  return isNode(node) ? (node.nodeName || '').toLowerCase() : '';
}
