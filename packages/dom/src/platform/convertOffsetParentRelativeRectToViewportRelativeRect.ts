import type {Elements, Rect, Strategy} from '@floating-ui/core';
import {createCoords} from '@floating-ui/utils';
import {
  getDocumentElement,
  getNodeName,
  getNodeScroll,
  isHTMLElement,
  isOverflowElement,
  isTopLayer,
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

  if (
    offsetParent === documentElement ||
    (elements && isTopLayer(elements.floating) && isFixed)
  ) {
    return rect;
  }

  let scroll = {scrollLeft: 0, scrollTop: 0};
  let scale = createCoords(1);
  let offsetX = 0;
  let offsetY = 0;
  const isOffsetParentAnElement = isHTMLElement(offsetParent);

  if (isOffsetParentAnElement || !isFixed) {
    if (
      getNodeName(offsetParent) !== 'body' ||
      isOverflowElement(documentElement)
    ) {
      scroll = getNodeScroll(offsetParent);
    }

    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsetX = offsetRect.x + offsetParent.clientLeft;
      offsetY = offsetRect.y + offsetParent.clientTop;
    }
  }

  const htmlOffset =
    !isOffsetParentAnElement && !isFixed
      ? getHTMLOffset(documentElement, scroll)
      : createCoords(0);

  if (!isOffsetParentAnElement && elements) {
    scale = createCoords((elements.floating as any).currentCSSZoom || 1);
  }

  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x:
      rect.x * scale.x -
      scroll.scrollLeft * (isOffsetParentAnElement ? scale.x : 1) +
      offsetX +
      htmlOffset.x,
    y:
      rect.y * scale.y -
      scroll.scrollTop * (isOffsetParentAnElement ? scale.y : 1) +
      offsetY +
      htmlOffset.y,
  };
}
