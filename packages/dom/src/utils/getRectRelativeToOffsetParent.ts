import type {Rect, Strategy} from '@floating-ui/core';
import {createCoords} from '@floating-ui/utils';
import {
  getNodeName,
  getNodeScroll,
  isHTMLElement,
  isOverflowElement,
} from '@floating-ui/utils/dom';

import type {VirtualElement} from '../types';
import {getDocumentElement} from '../platform/getDocumentElement';
import {getBoundingClientRect} from './getBoundingClientRect';
import {getWindowScrollBarX} from './getWindowScrollBarX';
import {getHTMLOffset} from './getHTMLOffset';

export function getRectRelativeToOffsetParent(
  element: Element | VirtualElement,
  offsetParent: Element | Window,
  strategy: Strategy,
  floating: Element,
): Rect {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const isFixed = strategy === 'fixed';
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);

  let scroll = {scrollLeft: 0, scrollTop: 0};
  let offsetX = 0;
  let offsetY = 0;

  if (isOffsetParentAnElement || !isFixed) {
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
      offsetX = offsetRect.x + offsetParent.clientLeft;
      offsetY = offsetRect.y + offsetParent.clientTop;
    }
  }

  // If the <body> scrollbar appears on the left (e.g. RTL systems). Use
  // Firefox with layout.scrollbar.side = 3 in about:config to test this.
  if (!isOffsetParentAnElement) {
    offsetX = getWindowScrollBarX(documentElement);
  }

  const htmlOffset =
    !isOffsetParentAnElement && !isFixed
      ? getHTMLOffset(documentElement, scroll)
      : createCoords(0);

  // When the offsetParent is the Window, every term above is in viewport
  // pixels, but the coords are written as `left`/`top` on the floating element,
  // which resolves them in its own CSS-zoom space.
  const zoom = isOffsetParentAnElement || (floating as any).currentCSSZoom || 1;

  return {
    x: (rect.left + scroll.scrollLeft - offsetX - htmlOffset.x) / zoom,
    y: (rect.top + scroll.scrollTop - offsetY - htmlOffset.y) / zoom,
    width: rect.width / zoom,
    height: rect.height / zoom,
  };
}
