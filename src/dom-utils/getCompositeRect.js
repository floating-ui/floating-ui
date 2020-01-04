// @flow
import type { Rect, VirtualElement, Offsets } from '../types';
import getBoundingClientRect from './getBoundingClientRect';
import getScrollSum from './getScrollSum';
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
  const scrollSum = getScrollSum(isFixed ? [] : [offsetParent]);
  const offsets =
    isHTMLElement(offsetParent) && !isFixed
      ? getInnerOffsets(offsetParent)
      : { x: 0, y: 0 };

  return {
    x: rect.left + scrollSum.scrollLeft - offsets.x,
    y: rect.top + scrollSum.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height,
  };
}
