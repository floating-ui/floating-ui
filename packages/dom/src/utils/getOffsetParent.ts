import {getComputedStyle} from './getComputedStyle';
import {getParentNode} from './getParentNode';
import {getWindow} from './getWindow';
import {
  isContainingBlock,
  isHTMLElement,
  isLastTraversableNode,
  isTableElement,
} from './is';
import {getNodeName} from './node';

type Polyfill = (element: HTMLElement) => Element | null;

function getTrueOffsetParent(
  element: Element,
  polyfill: Polyfill | undefined
): Element | null {
  if (
    !isHTMLElement(element) ||
    getComputedStyle(element).position === 'fixed'
  ) {
    return null;
  }

  if (polyfill) {
    return polyfill(element);
  }

  return element.offsetParent;
}

function getContainingBlock(element: Element) {
  let currentNode: Node | null = getParentNode(element);

  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else {
      currentNode = getParentNode(currentNode);
    }
  }

  return null;
}

// Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.
export function getOffsetParent(
  element: Element,
  polyfill?: Polyfill
): Element | Window {
  const window = getWindow(element);

  if (!isHTMLElement(element)) {
    return window;
  }

  let offsetParent = getTrueOffsetParent(element, polyfill);

  while (
    offsetParent &&
    isTableElement(offsetParent) &&
    getComputedStyle(offsetParent).position === 'static'
  ) {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }

  if (
    offsetParent &&
    (getNodeName(offsetParent) === 'html' ||
      (getNodeName(offsetParent) === 'body' &&
        getComputedStyle(offsetParent).position === 'static' &&
        !isContainingBlock(offsetParent)))
  ) {
    return window;
  }

  return offsetParent || getContainingBlock(element) || window;
}
