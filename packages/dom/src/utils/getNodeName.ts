import {isWindow} from './window';

export function getNodeName(node: Node | Window): string {
  return isWindow(node) ? '' : node ? (node.nodeName || '').toLowerCase() : '';
}
