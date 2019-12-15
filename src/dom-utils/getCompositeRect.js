// @flow
import type { Rect, VirtualElement } from '../types';
import getBoundingClientRect from './getBoundingClientRect';
import listScrollParents from './listScrollParents';
import getScrollSum from './getScrollSum';
import getOffsetParent from './getOffsetParent';
import unwrapVirtualElement from './unwrapVirtualElement';
import isTableElement from './isTableElement';
import getTrueOffsetParent from './getTrueOffsetParent';
import { isElement } from './instanceOf';

// Returns the composite rect of an element relative to its offsetParent.
// Composite means it takes into account transforms as well as layout.
export default (
  element: Element | VirtualElement,
  isFixed: boolean = false
): Rect => {
  const unwrappedElement = unwrapVirtualElement(element);
  const rect = getBoundingClientRect(element);
  const scrollParents = listScrollParents(unwrappedElement);
  const offsetParent = getOffsetParent(unwrappedElement);
  const offsetParentRect =
    isElement(offsetParent) && !isFixed
      ? getBoundingClientRect(offsetParent)
      : { left: 0, top: 0 };
  const trueOffsetParent = getTrueOffsetParent(unwrappedElement);

  // We want all the scrolling containers only up to and including the
  // offsetParent
  const relevantScrollParents =
    trueOffsetParent && isTableElement(trueOffsetParent)
      ? scrollParents
      : scrollParents.slice(
          0,
          Math.max(0, scrollParents.indexOf(offsetParent)) + 1
        );

  const scrollSum = getScrollSum(relevantScrollParents);
  const offsetParentScrollSum = getScrollSum(isFixed ? [offsetParent] : []);

  const width = rect.width;
  const height = rect.height;
  const x =
    rect.left +
    scrollSum.scrollLeft -
    offsetParentScrollSum.scrollLeft -
    offsetParentRect.left;
  const y =
    rect.top +
    scrollSum.scrollTop -
    offsetParentScrollSum.scrollTop -
    offsetParentRect.top;

  return { width, height, x, y };
};
