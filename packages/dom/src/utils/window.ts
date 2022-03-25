export function isWindow(value: any): value is Window {
  return (
    value &&
    value.document &&
    value.location &&
    value.alert &&
    value.setInterval
  );
}

export function getWindow(node: Node | Window): Window {
  if (node == null) {
    return window;
  }

  if (!isWindow(node)) {
    const ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }

  return node;
}
