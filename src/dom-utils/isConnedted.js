// @flow

// checks if element is attached to the context object
export default function isConnected(element: HTMLElement): boolean {
  if ('isConnected' in Node.prototype) {
    return element.isConnected;
  } else {
    return !element.ownerDocument ||
    !(
      element.ownerDocument.compareDocumentPosition(element) &
      Node.DOCUMENT_POSITION_DISCONNECTED
    )
  }
}
