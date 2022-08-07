// @flow
import getWindow from './getWindow';
import getNodeName from './getNodeName';
import getComputedStyle from './getComputedStyle';
import { isHTMLElement, isShadowRoot } from './instanceOf';
import isTableElement from './isTableElement';
import getParentNode from './getParentNode';
import getUAString from '../utils/userAgent';

function getTrueOffsetParent(element: Element): ?Element {
  if (
    !isHTMLElement(element) ||
    // https://github.com/popperjs/popper-core/issues/837
    getComputedStyle(element).position === 'fixed'
  ) {
    return null;
  }

  return element.offsetParent;
}

// `.offsetParent` reports `null` for fixed elements, while absolute elements
// return the containing block
function getContainingBlock(element: Element) {
  const isFirefox = /firefox/i.test(getUAString());
  const isIE = /Trident/i.test(getUAString());

  if (isIE && isHTMLElement(element)) {
    // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
    const elementCss = getComputedStyle(element);
    if (elementCss.position === 'fixed') {
      return null;
    }
  }

  let currentNode = getParentNode(element);

  if (isShadowRoot(currentNode)) {
    currentNode = currentNode.host;
  }

  while (
    isHTMLElement(currentNode) &&
    ['html', 'body'].indexOf(getNodeName(currentNode)) < 0
  ) {
    const css = getComputedStyle(currentNode);

    // This is non-exhaustive but covers the most common CSS properties that
    // create a containing block.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
    if (
      css.transform !== 'none' ||
      css.perspective !== 'none' ||
      css.contain === 'paint' ||
      ['transform', 'perspective'].indexOf(css.willChange) !== -1 ||
      (isFirefox && css.willChange === 'filter') ||
      (isFirefox && css.filter && css.filter !== 'none')
    ) {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }

  return null;
}

// Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.
export default function getOffsetParent(element: Element) {
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
        getComputedStyle(offsetParent).position === 'static'))
  ) {
    return window;
  }

  return offsetParent || getContainingBlock(element) || window;
}
