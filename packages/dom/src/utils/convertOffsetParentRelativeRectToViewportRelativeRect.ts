import type {Rect, Strategy} from '@floating-ui/core';

import {getBoundingClientRect} from './getBoundingClientRect';
import {getDocumentElement} from './getDocumentElement';
import {getNodeScroll} from './getNodeScroll';
import {getScale} from './getScale';
import {isHTMLElement, isOverflowElement} from './is';
import {getNodeName} from './node';

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
  let scale = {x: 1, y: 1};
  const offsets = {x: 0, y: 0};

  if (
    isOffsetParentAnElement ||
    (!isOffsetParentAnElement && strategy !== 'fixed')
  ) {
    if (
      getNodeName(offsetParent) !== 'body' ||
      isOverflowElement(documentElement)
    ) {
      scroll = getNodeScroll(offsetParent);
    }

    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }

  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y,
  };
}
