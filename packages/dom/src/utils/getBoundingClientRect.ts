import {ClientRectObject, VirtualElement} from '@floating-ui/core';
import {FALLBACK_SCALE, getScale} from './getScale';
import {isElement, isLayoutViewport} from './is';
import {getWindow} from './window';

export function getBoundingClientRect(
  element: Element | VirtualElement,
  includeScale = false,
  isFixedStrategy = false,
  offsetParent?: Element | Window
): ClientRectObject {
  const clientRect = element.getBoundingClientRect();

  let scale = FALLBACK_SCALE;
  if (includeScale) {
    if (offsetParent) {
      if (isElement(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }

  const win = isElement(element) ? getWindow(element) : window;
  const addVisualOffsets = !isLayoutViewport() && isFixedStrategy;

  let x =
    (clientRect.left +
      (addVisualOffsets ? win.visualViewport?.offsetLeft ?? 0 : 0)) /
    scale.x;
  let y =
    (clientRect.top +
      (addVisualOffsets ? win.visualViewport?.offsetTop ?? 0 : 0)) /
    scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;

  if (isElement(element)) {
    const iframe = element.ownerDocument.defaultView?.frameElement;
    if (iframe) {
      const iframeScale = getScale(iframe);
      const iframeRect = iframe.getBoundingClientRect();
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += iframeRect.x;
      y += iframeRect.y;
    }
  }

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
