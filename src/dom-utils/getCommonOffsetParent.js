// @flow
import getOffsetParent from './getOffsetParent';
import { isElement, isShadowRoot } from './instanceOf';
import getWindow from './getWindow';

function isOffsetContainer(element: Element): boolean {
  const firstElementChild = element.firstElementChild;
  return !firstElementChild || getOffsetParent(firstElementChild) === element;
}

function getRoot(node: Node): Node {
  const parentNode = node.parentNode;

  if (parentNode != null) {
    return getRoot(parentNode);
  }

  return node;
}

export default function getCommonOffsetParent(
  element1: Element,
  element2: Element
): Element {
  // If one of the nodes is inside shadowDOM, find which one
  const element1root = getRoot(element1);
  const element2root = getRoot(element2);

  if (isShadowRoot(element1root)) {
    return getCommonOffsetParent(element1root.host, element2);
  } else if (isShadowRoot(element2root)) {
    return getCommonOffsetParent(element1, element2root.host);
  }

  // Here we make sure to give as "start" the element that comes first in the DOM
  const order =
    element1.compareDocumentPosition(element2) &
    Node.DOCUMENT_POSITION_FOLLOWING;
  const start = order ? element1 : element2;
  const end = order ? element2 : element1;

  // Both nodes are inside #document
  // Get common ancestor container
  const range = document.createRange();
  range.setStart(start, 0);
  range.setEnd(end, 0);
  const commonAncestorContainer = range.commonAncestorContainer;

  // If ancestor container is not an element, we must return a safe
  // fallback, body is a good bet
  if (!isElement(commonAncestorContainer)) {
    return getWindow(commonAncestorContainer).body;
  }

  // if ancestor container is also an offset container, we found our winner
  if (isOffsetContainer(commonAncestorContainer)) {
    return commonAncestorContainer;
  }

  return getOffsetParent(commonAncestorContainer);
}
