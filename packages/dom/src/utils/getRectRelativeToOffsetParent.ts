import type {Rect, Strategy, VirtualElement} from '@floating-ui/core';
import {createCoords} from '@floating-ui/utils';
import {
  getNodeName,
  getNodeScroll,
  isHTMLElement,
  isOverflowElement,
} from '@floating-ui/utils/dom';

import {getDocumentElement} from '../platform/getDocumentElement';
import {getBoundingClientRect} from './getBoundingClientRect';
import {getWindowScrollBarX} from './getWindowScrollBarX';
import type {Platform} from '../types';
import {unwrapElement} from './unwrapElement';

export function getRectRelativeToOffsetParent(
  element: Element | VirtualElement,
  offsetParent: Element | Window,
  strategy: Strategy,
  floating: HTMLElement,
  topLayerFn: Platform['topLayer'],
): Rect {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const isFixed = strategy === 'fixed';
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);

  let scroll = {scrollLeft: 0, scrollTop: 0};
  const offsets = createCoords(0);

  if (isOffsetParentAnElement || (!isOffsetParentAnElement && !isFixed)) {
    if (
      getNodeName(offsetParent) !== 'body' ||
      isOverflowElement(documentElement)
    ) {
      scroll = getNodeScroll(offsetParent);
    }

    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(
        offsetParent,
        true,
        isFixed,
        offsetParent,
      );
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }

  let x = rect.left + scroll.scrollLeft - offsets.x;
  let y = rect.top + scroll.scrollTop - offsets.y;

  if (topLayerFn) {
    const topLayer = topLayerFn({
      reference: unwrapElement(element),
      floating,
    });

    if (topLayer.isTopLayer) {
      x += topLayer.x;
      y += topLayer.y;

      if (isOffsetParentAnElement) {
        x += offsetParent.clientLeft;
        y += offsetParent.clientTop;
      }
    }
  }

  return {
    x,
    y,
    width: rect.width,
    height: rect.height,
  };
}
