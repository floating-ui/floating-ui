// @flow
/*:: import type { Window, VirtualElement } from '../types'; */
/*:: declare function getWindow(node: Node | VirtualElement | Window): Window; */

export default function getWindow(node) {
  if (node.toString() !== '[object Window]') {
    const ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView : window;
  }

  return node;
}
