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

export function getRectRelativeToOffsetParent(
  element: Element | VirtualElement,
  offsetParent: Element | Window,
  strategy: Strategy,
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
      // If the <body> scrollbar appears on the left (e.g. RTL systems). Use
      // Firefox with layout.scrollbar.side = 3 in about:config to test this.
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }

  let htmlX = 0;
  let htmlY = 0;

  if (documentElement && !isOffsetParentAnElement && !isFixed) {
    const htmlRect = documentElement.getBoundingClientRect();
    htmlY = htmlRect.top + scroll.scrollTop;
    htmlX =
      htmlRect.left +
      scroll.scrollLeft -
      // RTL <body> scrollbar.
      getWindowScrollBarX(documentElement, htmlRect);
  }

  const x = rect.left + scroll.scrollLeft - offsets.x - htmlX;
  const y = rect.top + scroll.scrollTop - offsets.y - htmlY;

  return {
    x,
    y,
    width: rect.width,
    height: rect.height,
  };
}
