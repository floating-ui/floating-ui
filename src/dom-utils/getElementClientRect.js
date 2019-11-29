// @flow
import type { Rect } from '../types';
import getBoundingClientRect from './getBoundingClientRect';
import listScrollParents from './listScrollParents';
import getScrollSum from './getScrollSum';
import getOffsetParent from './getOffsetParent';
import getWindowScroll from './getWindowScroll';

// Returns the width, height and offsets of the provided element relative to the
// offsetParent
// TODO: take into account nested offsetParents
export default (element: Element): Rect => {
  const rect = getBoundingClientRect(element);
  const scrollParentsScroll = getScrollSum(listScrollParents(element));
  const windowScroll = getWindowScroll(element);
  const offsetParent = getOffsetParent(element);
  const isOffsetParentElement = offsetParent instanceof Element;
  const offsetParentRect = isOffsetParentElement
    ? getBoundingClientRect(offsetParent)
    : { left: 0, top: 0 };

  const scrollLeft =
    scrollParentsScroll.scrollLeft -
    (isOffsetParentElement ? windowScroll.scrollLeft : 0);
  const scrollTop =
    scrollParentsScroll.scrollTop -
    (isOffsetParentElement ? windowScroll.scrollTop : 0);

  const width = rect.width;
  const height = rect.height;
  const x = rect.left + scrollLeft - offsetParentRect.left;
  const y = rect.top + scrollTop - offsetParentRect.top;

  return { width, height, x, y };
};
