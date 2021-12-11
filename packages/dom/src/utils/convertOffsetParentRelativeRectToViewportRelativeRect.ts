import type {Rect, Strategy} from '@floating-ui/core';
import {getBoundingClientRect} from './getBoundingClientRect';
import {getNodeScroll} from './getNodeScroll';
import {getNodeName} from './getNodeName';
import {getDocumentElement} from './getDocumentElement';
import {isHTMLElement, isScrollParent} from './is';

export function convertOffsetParentRelativeRectToViewportRelativeRect({
  rect,
  offsetParent,
  strategy,
}: {
  rect: Rect;
  offsetParent: Element | Window;
  strategy: Strategy;
}): Rect {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);

  if (offsetParent === documentElement) {
    return rect;
  }

  let scroll = {scrollLeft: 0, scrollTop: 0};
  const offsets = {x: 0, y: 0};

  if (
    isOffsetParentAnElement ||
    (!isOffsetParentAnElement && strategy !== 'fixed')
  ) {
    if (
      getNodeName(offsetParent) !== 'body' ||
      isScrollParent(documentElement)
    ) {
      scroll = getNodeScroll(offsetParent);
    }

    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent, true);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
    // This doesn't appear to be need to be negated.
    // else if (documentElement) {
    //   offsets.x = getWindowScrollBarX(documentElement);
    // }
  }

  return {
    ...rect,
    x: rect.x - scroll.scrollLeft + offsets.x,
    y: rect.y - scroll.scrollTop + offsets.y,
  };
}
