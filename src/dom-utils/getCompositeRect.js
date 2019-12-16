// @flow
import type { Rect, VirtualElement } from '../types';
import getBoundingClientRect from './getBoundingClientRect';
import getScrollSum from './getScrollSum';
import unwrapVirtualElement from './unwrapVirtualElement';
import { isElement } from './instanceOf';

// Returns the composite rect of an element relative to its offsetParent.
// Composite means it takes into account transforms as well as layout.
export default (
  elementOrVirtualElement: Element | VirtualElement,
  commonOffsetParent: Element,
  isFixed: boolean = false
): Rect => {
  const element = unwrapVirtualElement(elementOrVirtualElement);
  const rect = getBoundingClientRect(element);
  const offsetParentRect =
    isElement(commonOffsetParent) && !isFixed
      ? getBoundingClientRect(commonOffsetParent)
      : { left: 0, top: 0 };
  const offsetParentScrollSum = getScrollSum(
    isFixed ? [] : [commonOffsetParent]
  );

  const width = rect.width;
  const height = rect.height;
  const x =
    rect.left + offsetParentScrollSum.scrollLeft - offsetParentRect.left;
  const y = rect.top + offsetParentScrollSum.scrollTop - offsetParentRect.top;

  return { width, height, x, y };
};
