// @flow

export default function getDocumentElement(element: Element): HTMLElement {
  // $FlowFixMe: assume body is always available
  return element.ownerDocument.documentElement;
}
