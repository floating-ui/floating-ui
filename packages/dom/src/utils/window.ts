import {isNode} from './is';

export function getWindow(node: Node | Window): Window {
  if (isNode(node)) {
    return node.ownerDocument?.defaultView || window;
  }

  return node;
}
