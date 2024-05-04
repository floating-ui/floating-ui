import {
  getComputedStyle,
  getContainingBlock,
  getParentNode,
  getWindow,
  isContainingBlock,
  isElement,
  isHTMLElement,
  isLastTraversableNode,
  isStaticPositioned,
  isTableElement,
} from '@floating-ui/utils/dom';
import {isTopLayer} from '../utils/isTopLayer';

type Polyfill = (element: HTMLElement) => Element | null;

function getTrueOffsetParent(
  element: Element,
  polyfill: Polyfill | undefined,
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

// Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.
export function getOffsetParent(
  element: Element,
  polyfill?: Polyfill,
): Element | Window {
  const window = getWindow(element);

  if (isHTMLElement(element)) {
    if (isTopLayer(element)) {
      return window;
    }
  } else {
    let svgOffsetParent = getParentNode(element);
    while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
      if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
        return svgOffsetParent;
      }
      svgOffsetParent = getParentNode(svgOffsetParent);
    }
    return window;
  }

  let offsetParent = getTrueOffsetParent(element, polyfill);

  while (
    offsetParent &&
    isTableElement(offsetParent) &&
    isStaticPositioned(offsetParent)
  ) {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }

  if (
    offsetParent &&
    isLastTraversableNode(offsetParent) &&
    isStaticPositioned(offsetParent) &&
    !isContainingBlock(offsetParent)
  ) {
    return window;
  }

  return offsetParent || getContainingBlock(element) || window;
}
