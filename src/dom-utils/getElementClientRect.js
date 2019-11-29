// @flow
import type { Rect } from '../types';
import getBoundingClientRect from './getBoundingClientRect';
import listScrollParents from './listScrollParents';
import getScrollSum from './getScrollSum';
import getOffsetParent from './getOffsetParent';
import getWindowScroll from './getWindowScroll';

// Returns the width, height and offsets of the provided element relative to the
// offsetParent
export default (element: Element): Rect => {
  const rect = getBoundingClientRect(element);
  const offsetParent = getOffsetParent(element);
  const scrollParentsScroll = getScrollSum(listScrollParents(element));
  const windowScroll = getWindowScroll(element);
  const scrollLeft = scrollParentsScroll.scrollLeft - windowScroll.scrollLeft;
  const scrollTop = scrollParentsScroll.scrollTop - windowScroll.scrollTop;
  const { left, top } =
    offsetParent instanceof Element
      ? getBoundingClientRect(offsetParent)
      : { left: 0, top: 0 };

  const width = rect.width;
  const height = rect.height;
  const x = rect.left + scrollLeft - left;
  const y = rect.top + scrollTop - top;

  return { width, height, x, y };
};
