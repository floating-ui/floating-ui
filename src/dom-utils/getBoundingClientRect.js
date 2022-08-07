// @flow
import type { ClientRectObject, VirtualElement } from '../types';
import { isElement, isHTMLElement } from './instanceOf';
import { round } from '../utils/math';
import getWindow from './getWindow';
import isLayoutViewport from './isLayoutViewport';

export default function getBoundingClientRect(
  element: Element | VirtualElement,
  includeScale: boolean = false,
  isFixedStrategy: boolean = false
): ClientRectObject {
  const clientRect = element.getBoundingClientRect();
  let scaleX = 1;
  let scaleY = 1;

  if (includeScale && isHTMLElement(element)) {
    scaleX =
      (element: HTMLElement).offsetWidth > 0
        ? round(clientRect.width) / (element: HTMLElement).offsetWidth || 1
        : 1;
    scaleY =
      (element: HTMLElement).offsetHeight > 0
        ? round(clientRect.height) / (element: HTMLElement).offsetHeight || 1
        : 1;
  }

  const { visualViewport } = isElement(element) ? getWindow(element) : window;
  const addVisualOffsets = !isLayoutViewport() && isFixedStrategy;

  const x =
    (clientRect.left +
      (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) /
    scaleX;
  const y =
    (clientRect.top +
      (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) /
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
