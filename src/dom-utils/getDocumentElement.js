// @flow

export default function getDocumentElement(element: Element): HTMLElement {
  return element.ownerDocument.documentElement;
}
