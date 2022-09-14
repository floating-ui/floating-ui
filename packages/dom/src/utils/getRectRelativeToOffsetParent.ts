import type {Rect, Strategy, VirtualElement} from '@floating-ui/core';
import {getBoundingClientRect} from './getBoundingClientRect';
import {getDocumentElement} from './getDocumentElement';
import {getNodeName} from './getNodeName';
import {getNodeScroll} from './getNodeScroll';
import getWindowScrollBarX from './getWindowScrollBarX';
import {isElement, isHTMLElement, isOverflowElement} from './is';
import {round} from './math';
import {getWindow, isWindow} from './window';

function isScaled(element: HTMLElement): boolean {
  const rect = getBoundingClientRect(element);
  return (
    round(rect.width) !== element.offsetWidth ||
    round(rect.height) !== element.offsetHeight
  );
}

export function getRectRelativeToOffsetParent(
  element: Element | VirtualElement,
  offsetParent: Element | Window,
  strategy: Strategy
): Rect {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const rect = getBoundingClientRect(
    element,
    // @ts-ignore - checked above (TS 4.1 compat)
    isOffsetParentAnElement && isScaled(offsetParent),
    strategy === 'fixed'
  );

  let scroll = {scrollLeft: 0, scrollTop: 0};
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
      const offsetRect = getBoundingClientRect(offsetParent, true);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }

  const ownerDocOffset = {x: 0, y: 0};

  const referenceWindow = isElement(element) ? getWindow(element) : window;
  const offsetParentWindow = isWindow(element) ? offsetParent : getWindow(offsetParent);
  console.log({samesies: referenceWindow === offsetParentWindow, referenceWindow, offsetParentWindow})


  // TODO: improve checks
  const MAX_ITERATIONS = 5;
  let iterationCount = 0;
  let nextWindow: Window | null = referenceWindow;
  while (
    iterationCount < MAX_ITERATIONS &&
    nextWindow &&
    nextWindow !== offsetParentWindow
  ) {
    iterationCount += 1;

    const iframe: Element | null = nextWindow.frameElement;

    if (iframe === null) {
      nextWindow = null;
    }

    const bcr = iframe?.getBoundingClientRect();
    console.log({iterationCount, bcr});
    ownerDocOffset.x += bcr?.left ?? 0;
    ownerDocOffset.y += bcr?.top ?? 0;

    nextWindow = iframe?.ownerDocument?.defaultView ?? null;
  }

  return {
    x: rect.left + scroll.scrollLeft - offsets.x + ownerDocOffset.x,
    y: rect.top + scroll.scrollTop - offsets.y + ownerDocOffset.y,
    width: rect.width,
    height: rect.height,
  };
}
