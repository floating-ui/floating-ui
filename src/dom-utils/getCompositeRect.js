// @flow
import type { Rect, VirtualElement } from '../types';
import getBoundingClientRect from './getBoundingClientRect';
import getNodeScroll from './getNodeScroll';
import getNodeName from './getNodeName';
import { isHTMLElement } from './instanceOf';

// Returns the composite rect of an element relative to its offsetParent.
// Composite means it takes into account transforms as well as layout.
export default function getCompositeRect(
  elementOrVirtualElement: Element | VirtualElement,
  offsetParent: Element,
  isFixed: boolean = false
): Rect {
  const rect = getBoundingClientRect(elementOrVirtualElement);

  let scroll = { scrollLeft: 0, scrollTop: 0 };
  let offsets = { x: 0, y: 0 };

  if (!isFixed) {
    if (getNodeName(offsetParent) !== 'body') {
      scroll = getNodeScroll(offsetParent);
    }

    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    }
  }

  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height,
  };
}
