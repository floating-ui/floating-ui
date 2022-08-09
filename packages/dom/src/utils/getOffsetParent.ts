import {getNodeName} from './getNodeName';
import {getParentNode} from './getParentNode';
import {getWindow} from './window';
import {getComputedStyle} from './getComputedStyle';
import {
  isContainingBlock,
  isHTMLElement,
  isShadowRoot,
  isTableElement,
} from './is';

function getTrueOffsetParent(element: Element): Element | null {
  if (
    !isHTMLElement(element) ||
    getComputedStyle(element).position === 'fixed'
  ) {
    return null;
  }

  return composedOffsetParent(element);
}

/**
 * Polyfills the old offsetParent behavior from before the spec was changed:
 * https://github.com/w3c/csswg-drafts/issues/159
 */
function composedOffsetParent(element: HTMLElement): Element | null {
  let {offsetParent} = element;

  let ancestor: Element = element;
  let foundInsideSlot = false;

  while (ancestor && ancestor !== offsetParent) {
    const {assignedSlot} = ancestor;

    if (assignedSlot) {
      let newOffsetParent = assignedSlot.offsetParent;

      if (getComputedStyle(assignedSlot).display === 'contents') {
        const hadStyleAttribute = assignedSlot.hasAttribute('style');
        const oldDisplay = assignedSlot.style.display;
        assignedSlot.style.display = getComputedStyle(ancestor).display;

        newOffsetParent = assignedSlot.offsetParent;

        assignedSlot.style.display = oldDisplay;
        if (!hadStyleAttribute) {
          assignedSlot.removeAttribute('style');
        }
      }

      ancestor = assignedSlot;
      if (offsetParent !== newOffsetParent) {
        offsetParent = newOffsetParent;
        foundInsideSlot = true;
      }
    } else if (isShadowRoot(ancestor) && ancestor.host && foundInsideSlot) {
      break;
    }
    ancestor = ((isShadowRoot(ancestor) && ancestor.host) ||
      ancestor.parentNode) as Element;
  }

  return offsetParent;
}

function getContainingBlock(element: Element) {
  let currentNode: Node | null = getParentNode(element);

  if (isShadowRoot(currentNode)) {
    currentNode = currentNode.host;
  }

  while (
    isHTMLElement(currentNode) &&
    !['html', 'body'].includes(getNodeName(currentNode))
  ) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else {
      const parent = currentNode.parentNode as Node;
      currentNode = isShadowRoot(parent) ? parent.host : parent;
    }
  }

  return null;
}

// Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.
export function getOffsetParent(element: Element): Element | Window {
  const window = getWindow(element);

  let offsetParent = getTrueOffsetParent(element);

  while (
    offsetParent &&
    isTableElement(offsetParent) &&
    getComputedStyle(offsetParent).position === 'static'
  ) {
    offsetParent = getTrueOffsetParent(offsetParent);
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
