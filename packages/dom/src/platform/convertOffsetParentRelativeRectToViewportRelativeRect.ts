import type {Elements, Rect, Strategy} from '@floating-ui/core';
import {createCoords} from '@floating-ui/utils';
import {
  getDocumentElement,
  getNodeName,
  getNodeScroll,
  isHTMLElement,
  isOverflowElement,
} from '@floating-ui/utils/dom';

import {getBoundingClientRect} from '../utils/getBoundingClientRect';
import {getScale} from './getScale';
import {getTopLayerData} from '../utils/getTopLayerData';

export function convertOffsetParentRelativeRectToViewportRelativeRect({
  elements,
  rect,
  offsetParent,
  strategy,
}: {
  elements?: Elements;
  rect: Rect;
  offsetParent: Element | Window;
  strategy: Strategy;
}): Rect {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);

  const [isOnTopLayer] = elements ? getTopLayerData(elements) : [false];

  if (offsetParent === documentElement || isOnTopLayer) {
    return rect;
  }

  let scroll = {scrollLeft: 0, scrollTop: 0};
  let scale = createCoords(1);
  const offsets = createCoords(0);

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
