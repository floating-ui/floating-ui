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

export function getRectRelativeToOffsetParent(
  element: Element | VirtualElement,
  offsetParent: Element | Window,
  floating: HTMLElement,
  strategy: Strategy,
  isTopLayer: boolean,
  handleTopLayerCoordinates: (state: {
    x: number;
    y: number;
    elements: {
      reference: Element | VirtualElement;
      floating: HTMLElement;
    };
  }) => {x: number; y: number},
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
      offsets.x = offsetRect.x + (isTopLayer ? 0 : offsetParent.clientLeft);
      offsets.y = offsetRect.y + (isTopLayer ? 0 : offsetParent.clientTop);
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }

  const {x, y} = handleTopLayerCoordinates({
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    elements: {
      reference: element,
      floating,
    },
  });

  return {
    x,
    y,
    width: rect.width,
    height: rect.height,
  };
}
