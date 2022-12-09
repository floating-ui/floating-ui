import type {ClientRectObject, VirtualElement} from '@floating-ui/core';
import {FALLBACK_SCALE, getScale} from './getScale';
import {isElement, isLayoutViewport} from './is';
import {getWindow} from './window';

export function getBoundingClientRect(
  element: Element | VirtualElement,
  includeScale = false,
  isFixedStrategy = false
): ClientRectObject {
  const clientRect = element.getBoundingClientRect();
  const scale = includeScale ? getScale(element) : FALLBACK_SCALE;
  const win = isElement(element) ? getWindow(element) : window;
  const addVisualOffsets = !isLayoutViewport() && isFixedStrategy;

  const x =
    (clientRect.left +
      (addVisualOffsets ? win.visualViewport?.offsetLeft ?? 0 : 0)) /
    scale.x;
  const y =
    (clientRect.top +
      (addVisualOffsets ? win.visualViewport?.offsetTop ?? 0 : 0)) /
    scale.y;
  const width = clientRect.width / scale.x;
  const height = clientRect.height / scale.y;

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
