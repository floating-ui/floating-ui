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

  let scaleX = 1;
  let scaleY = 1;

  if (includeScale && isHTMLElement(element)) {
    scaleX =
      element.offsetWidth > 0
        ? round(clientRect.width) / element.offsetWidth || 1
        : 1;
    scaleY =
      element.offsetHeight > 0
        ? round(clientRect.height) / element.offsetHeight || 1
        : 1;
  }

  const win = isElement(element) ? getWindow(element) : window;
  const addVisualOffsets = !isLayoutViewport() && isFixedStrategy;

  const x0 = clientRect.left +
    (addVisualOffsets ? win.visualViewport?.offsetLeft ?? 0 : 0);
  const y0 = clientRect.top +
    (addVisualOffsets ? win.visualViewport?.offsetTop ?? 0 : 0);

  const x = scaleX < 1 ? x0 * scaleX : x0 / scaleX;
  const y = scaleY < 1 ? y0 * scaleY : y0 / scaleY;
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
