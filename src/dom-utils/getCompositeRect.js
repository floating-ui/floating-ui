// @flow
import type { Rect, VirtualElement } from '../types';
import getBoundingClientRect from './getBoundingClientRect';
import getScrollSum from './getScrollSum';
import getBorders from './getBorders';
import { isHTMLElement } from './instanceOf';

// offsets without `border`
const getInnerOffsets = (offsetParent: Element): { x: number, y: number } => {
  const rect = getBoundingClientRect(offsetParent);
  const borders = getBorders(offsetParent);

  return {
    x: rect.x + borders.left,
    y: rect.y + borders.top,
  };
};

// Returns the composite rect of an element relative to its offsetParent.
// Composite means it takes into account transforms as well as layout.
export default (
  elementOrVirtualElement: Element | VirtualElement,
  offsetParent: Element,
  isFixed: boolean = false
): Rect => {
  const rect = getBoundingClientRect(elementOrVirtualElement);
  const scrollSum = getScrollSum(isFixed ? [] : [offsetParent]);
  const offsets =
    isHTMLElement(offsetParent) && !isFixed
      ? getInnerOffsets(offsetParent)
      : { x: 0, y: 0 };

  const width = rect.width;
  const height = rect.height;
  const x = rect.left + scrollSum.scrollLeft - offsets.x;
  const y = rect.top + scrollSum.scrollTop - offsets.y;

  return { width, height, x, y };
};
