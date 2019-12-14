// @flow
import type { Rect, VirtualElement } from '../types';
import getBoundingClientRect from './getBoundingClientRect';
import listScrollParents from './listScrollParents';
import getScrollSum from './getScrollSum';
import getOffsetParent from './getOffsetParent';
import unwrapVirtualElement from './unwrapVirtualElement';
import { isElement, isHTMLElement } from './instanceOf';

// Returns the width, height and offsets of the provided element relative to the
// offsetParent
export default (
  element: Element | VirtualElement,
  isFixed: boolean = false,
  // For the popper and arrow, we need to use their layout measurements before
  // any transforms. For the reference, we need to use composite measurements
  // after any transforms
  isLayout: boolean = true
): Rect => {
  if (isLayout && isHTMLElement(element)) {
    return {
      x: element.offsetLeft,
      y: element.offsetTop,
      width: element.offsetWidth,
      height: element.offsetHeight,
    };
  }

  const unwrappedElement = unwrapVirtualElement(element);
  const rect = getBoundingClientRect(element);
  const scrollParents = listScrollParents(unwrappedElement);
  const offsetParent = getOffsetParent(unwrappedElement);
  const offsetParentRect =
    isElement(offsetParent) && !isFixed
      ? getBoundingClientRect(offsetParent)
      : { left: 0, top: 0 };

  // We want all the scrolling containers only up to and including the
  // offsetParent
  const relevantScrollParents = scrollParents.slice(
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
