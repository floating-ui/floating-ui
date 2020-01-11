// @flow

export default function getWindow(node: Node): any {
  if ({}.toString.call(node) !== '[object Window]') {
    const ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView : window;
  }

  return node;
}
