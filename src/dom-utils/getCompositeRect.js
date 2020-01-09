// @flow
import type { Rect, VirtualElement, Offsets } from '../types';
import getBoundingClientRect from './getBoundingClientRect';
import getNodeScroll from './getNodeScroll';
import getNodeName from './getNodeName';
import getBorders from './getBorders';
import { isHTMLElement } from './instanceOf';

// offsets without `border`
function getInnerOffsets(offsetParent: Element): Offsets {
  const rect = getBoundingClientRect(offsetParent);
  const borders = getBorders(offsetParent);

  return {
    x: rect.x + borders.left,
    y: rect.y + borders.top,
  };
}

// Returns the composite rect of an element relative to its offsetParent.
// Composite means it takes into account transforms as well as layout.
export default function getCompositeRect(
  elementOrVirtualElement: Element | VirtualElement,
  offsetParent: Element,
  isFixed: boolean = false
): Rect {
  const rect = getBoundingClientRect(elementOrVirtualElement);

  let scroll = { scrollLeft: 0, scrollTop: 0 };
  let offsets = { x: 0, y: 0 };

  if (!isFixed) {
    if (getNodeName(offsetParent) !== 'body') {
      scroll = getNodeScroll(offsetParent);
    }

    if (isHTMLElement(offsetParent)) {
      offsets = getInnerOffsets(offsetParent);
    }
  }

  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height,
  };
}
