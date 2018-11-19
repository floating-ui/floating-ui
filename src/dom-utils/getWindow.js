// @flow
export default function getWindow(node: Node) {
  const ownerDocument = node.ownerDocument;
  return ownerDocument ? ownerDocument.defaultView : window;
}
