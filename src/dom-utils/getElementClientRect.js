// @flow
import type { Rect } from '../types';
import getBoundingClientRect from './getBoundingClientRect';
import listScrollParents from './listScrollParents';
import getScrollSum from './getScrollSum';

// Returns the width, height and offsets of the provided element relative to the
// offsetParent
export default (element: HTMLElement): Rect => {
  const rect = getBoundingClientRect(element);
  const { scrollLeft, scrollTop } = getScrollSum(listScrollParents(element));

  const width = rect.width;
  const height = rect.height;
  const x = rect.left + scrollLeft;
  const y = rect.top + scrollTop;

  return { width, height, x, y };
};
