import {ClientRectObject, VirtualElement} from '@floating-ui/core';
import {FALLBACK_SCALE, getScale} from './getScale';
import {isElement, isLayoutViewport} from './is';
import {unwrapElement} from './unwrapElement';
import {getWindow} from './window';

export function getBoundingClientRect(
  element: Element | VirtualElement,
  includeScale = false,
  isFixedStrategy = false,
  offsetParent?: Element | Window
): ClientRectObject {
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);

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

  const win = domElement ? getWindow(domElement) : window;
  const addVisualOffsets = !isLayoutViewport() && isFixedStrategy;

  let x =
    (clientRect.left +
      (addVisualOffsets ? win.visualViewport?.offsetLeft || 0 : 0)) /
    scale.x;
  let y =
    (clientRect.top +
      (addVisualOffsets ? win.visualViewport?.offsetTop || 0 : 0)) /
    scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;

  if (domElement) {
    const win = getWindow(domElement);
    const iframe = win.frameElement;
    const offsetWin =
      offsetParent && isElement(offsetParent)
        ? getWindow(offsetParent)
        : offsetParent;
    const shouldInclude = offsetParent && offsetWin !== win;

    if (iframe && shouldInclude) {
      const iframeScale = getScale(iframe);
      const iframeRect = iframe.getBoundingClientRect();
      const css = getComputedStyle(iframe);

      iframeRect.x += iframe.clientLeft + parseFloat(css.paddingLeft);
      iframeRect.y += iframe.clientTop + parseFloat(css.paddingTop);

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
