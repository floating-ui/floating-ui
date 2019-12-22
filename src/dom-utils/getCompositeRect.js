// @flow
import type { Rect, VirtualElement } from '../types';
import getBoundingClientRect from './getBoundingClientRect';
import getComputedStyle from './getComputedStyle';
import getScrollSum from './getScrollSum';
import { isHTMLElement } from './instanceOf';

// offsets without `border`
const getInnerOffsets = (element: HTMLElement): { x: number, y: number } => {
  const { borderLeft, borderTop } = getComputedStyle(element);
  const rect = getBoundingClientRect(element);

  return {
    x: rect.x + (parseFloat(borderLeft) || 0),
    y: rect.y + (parseFloat(borderTop) || 0),
  };
};

// Returns the composite rect of an element relative to its offsetParent.
// Composite means it takes into account transforms as well as layout.
export default (
  elementOrVirtualElement: Element | VirtualElement,
  commonOffsetParent: Element,
  isFixed: boolean = false
): Rect => {
  const rect = getBoundingClientRect(elementOrVirtualElement);
  const offsetParentRect =
    isHTMLElement(commonOffsetParent) && !isFixed
      ? getInnerOffsets(commonOffsetParent)
      : { x: 0, y: 0 };
  const offsetParentScrollSum = getScrollSum(
    isFixed ? [] : [commonOffsetParent]
  );

  const width = rect.width;
  const height = rect.height;
  const x = rect.left + offsetParentScrollSum.scrollLeft - offsetParentRect.x;
  const y = rect.top + offsetParentScrollSum.scrollTop - offsetParentRect.y;

  return { width, height, x, y };
};
