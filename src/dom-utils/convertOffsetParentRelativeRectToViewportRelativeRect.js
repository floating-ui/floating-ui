// @flow
import type { Rect, Window, PositioningStrategy } from '../types';
import getBoundingClientRect from './getBoundingClientRect';
import getNodeScroll from './getNodeScroll';
import getNodeName from './getNodeName';
import { isHTMLElement } from './instanceOf';
import getDocumentElement from './getDocumentElement';
import isScrollParent from './isScrollParent';
import rectToClientRect from '../utils/rectToClientRect';

export default function convertOffsetParentRelativeRectToViewportRelativeRect({
  rect,
  offsetParent,
  strategy,
}: {
  rect: Rect,
  offsetParent: Element | Window,
  strategy: PositioningStrategy,
}): Rect {
  const documentElement = getDocumentElement(offsetParent);

  if (offsetParent === documentElement) {
    return rect;
  }

  let scroll = { scrollLeft: 0, scrollTop: 0 };
  let offsetClientRect = rectToClientRect({ x: 0, y: 0, width: 0, height: 0 });

  if (isHTMLElement(offsetParent)) {
    offsetClientRect = getBoundingClientRect(offsetParent);
  }

  if (
    isHTMLElement(offsetParent) ||
    (!isHTMLElement(offsetParent) && strategy !== 'fixed')
  ) {
    if (
      getNodeName(offsetParent) !== 'body' ||
      // https://github.com/popperjs/popper-core/issues/1078
      isScrollParent(documentElement)
    ) {
      scroll = getNodeScroll(offsetParent);
    }

    if (isHTMLElement(offsetParent)) {
      offsetClientRect = getBoundingClientRect(offsetParent);
      offsetClientRect.x -= offsetParent.clientLeft;
      offsetClientRect.y -= offsetParent.clientTop;
    }
  }

  return {
    x: rect.x - scroll.scrollLeft + offsetClientRect.left,
    y: rect.y - scroll.scrollTop + offsetClientRect.top,
    width: rect.width,
    height: rect.height,
  };
}
