// @flow
/*:: import type { Window } from '../types'; */
/*:: declare function getWindow(node: Node | Window): Window; */

export default function getWindow(node) {
  if (node == null) {
      return window;
  }
      
  if (node.toString() !== '[object Window]') {
    const ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }

  return node;
}
