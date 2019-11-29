// @flow
import type { Rect } from '../types';
import getBoundingClientRect from './getBoundingClientRect';
import listScrollParents from './listScrollParents';
import getScrollSum from './getScrollSum';
import getOffsetParent from './getOffsetParent';

// Returns the width, height and offsets of the provided element relative to the
// offsetParent
export default (element: Element): Rect => {
  const rect = getBoundingClientRect(element);
  const scrollParentsScroll = getScrollSum(listScrollParents(element));
  const directOffsetParent = getOffsetParent(element);
  const isOffsetParentElement = directOffsetParent instanceof Element;
  const directOffsetParentRect = isOffsetParentElement
    ? getBoundingClientRect(directOffsetParent)
    : { left: 0, top: 0 };

  const scrollLeft = scrollParentsScroll.scrollLeft;
  const scrollTop = scrollParentsScroll.scrollTop;

  const ancestorOffsetParents = [];
  let currentOffsetParent = directOffsetParent;

  while (currentOffsetParent instanceof Element) {
    currentOffsetParent = getOffsetParent(currentOffsetParent);
    ancestorOffsetParents.push(currentOffsetParent);
  }

  const ancestorOffsetParentScrollSum = getScrollSum(ancestorOffsetParents);

  const width = rect.width;
  const height = rect.height;
  const x =
    rect.left +
    scrollLeft -
    directOffsetParentRect.left -
    ancestorOffsetParentScrollSum.scrollLeft;
  const y =
    rect.top +
    scrollTop -
    directOffsetParentRect.top -
    ancestorOffsetParentScrollSum.scrollTop;

  return { width, height, x, y };
};
