import type {Elements, Rect, Strategy} from '@floating-ui/core';
import {createCoords} from '@floating-ui/utils';
import {
  getDocumentElement,
  getNodeName,
  getNodeScroll,
  isElement,
  isHTMLElement,
  isOverflowElement,
} from '@floating-ui/utils/dom';

import {getBoundingClientRect} from '../utils/getBoundingClientRect';
import {getScale} from './getScale';
import {getHTMLOffset} from '../utils/getHTMLOffset';

export function convertOffsetParentRelativeRectToViewportRelativeRect({
  elements,
  rect,
  offsetParent,
  strategy,
}: {
  elements?: Elements | undefined;
  rect: Rect;
  offsetParent: Element | Window;
  strategy: Strategy;
}): Rect {
  const isFixed = strategy === 'fixed';
  const documentElement = getDocumentElement(offsetParent);

  if (offsetParent === documentElement) {
    return rect;
  }

  let scroll = {scrollLeft: 0, scrollTop: 0};
  let scale = createCoords(1);
  let offsetX = 0;
  let offsetY = 0;
  const isOffsetParentAnHTMLElement = isHTMLElement(offsetParent);

  if (isOffsetParentAnHTMLElement || !isFixed) {
    if (
      getNodeName(offsetParent) !== 'body' ||
      isOverflowElement(documentElement)
    ) {
      scroll = getNodeScroll(offsetParent);
    }

    if (isOffsetParentAnHTMLElement) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsetX = offsetRect.x + offsetParent.clientLeft;
      offsetY = offsetRect.y + offsetParent.clientTop;
    }
  }

  const htmlOffset =
    !isOffsetParentAnHTMLElement && !isFixed
      ? getHTMLOffset(documentElement, scroll)
      : createCoords(0);

  if (!isElement(offsetParent) && elements) {
    scale = createCoords((elements.floating as any).currentCSSZoom || 1);
  }

  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x:
      rect.x * scale.x -
      scroll.scrollLeft * (isOffsetParentAnHTMLElement ? scale.x : 1) +
      offsetX +
      htmlOffset.x,
    y:
      rect.y * scale.y -
      scroll.scrollTop * (isOffsetParentAnHTMLElement ? scale.y : 1) +
      offsetY +
      htmlOffset.y,
  };
}
