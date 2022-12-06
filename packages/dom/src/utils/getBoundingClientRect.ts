import type {ClientRectObject, VirtualElement} from '@floating-ui/core';
import {isElement, isHTMLElement, isLayoutViewport} from './is';
import {round} from './math';
import {getWindow} from './window';

export function getBoundingClientRect(
  element: Element | VirtualElement,
  includeScale = false,
  isFixedStrategy = false
): ClientRectObject {
  const clientRect = element.getBoundingClientRect();

  let contextRect = clientRect;
  let elementToCheckForScale = element;
  let scaleX = 1;
  let scaleY = 1;

  if (!isElement(element) && element.contextElement) {
    contextRect = element.contextElement.getBoundingClientRect();
    elementToCheckForScale = element.contextElement;
  }

  if (includeScale && isHTMLElement(elementToCheckForScale)) {
    scaleX =
      elementToCheckForScale.offsetWidth > 0
        ? round(contextRect.width) / elementToCheckForScale.offsetWidth || 1
        : 1;
    scaleY =
      elementToCheckForScale.offsetHeight > 0
        ? round(contextRect.height) / elementToCheckForScale.offsetHeight || 1
        : 1;
  }

  const win = isElement(element) ? getWindow(element) : window;
  const addVisualOffsets = !isLayoutViewport() && isFixedStrategy;

  const x =
    (clientRect.left +
      (addVisualOffsets ? win.visualViewport?.offsetLeft ?? 0 : 0)) /
    scaleX;
  const y =
    (clientRect.top +
      (addVisualOffsets ? win.visualViewport?.offsetTop ?? 0 : 0)) /
    scaleY;
  const width = clientRect.width / scaleX;
  const height = clientRect.height / scaleY;

  return {
    width,
    height,
    top: y,
    right: x + width,
    bottom: y + height,
    left: x,
    x,
    y,
  };
}
