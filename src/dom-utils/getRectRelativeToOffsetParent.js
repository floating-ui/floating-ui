// @flow
import type { Rect, VirtualElement } from '../types';
import getBoundingClientRect from './getBoundingClientRect';
import listScrollParents from './listScrollParents';
import getScrollSum from './getScrollSum';
import getOffsetParent from './getOffsetParent';
import unwrapVirtualElement from './unwrapVirtualElement';
import { isElement } from './instanceOf';

// Returns the width, height and offsets of the provided element relative to the
// offsetParent
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

  const relevantScrollParents = [];

  // We want all the scrolling containers only up to and including the
  // offsetParent
  for (let i = 0; i < scrollParents.length; i++) {
    const scrollParent = scrollParents[i];
    relevantScrollParents.push(scrollParent);

    if (scrollParent === offsetParent) {
      break;
    }
  }

  const scrollSum = getScrollSum(relevantScrollParents);
  const offsetParentScrollSum = isFixed
    ? getScrollSum([offsetParent])
    : { scrollLeft: 0, scrollTop: 0 };

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
