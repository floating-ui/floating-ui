import type {ClientRectObject, VirtualElement} from '@floating-ui/core';
import {rectToClientRect} from '@floating-ui/core';

import {FALLBACK_SCALE, getScale} from './getScale';
import {getVisualOffsets} from './getVisualOffsets';
import {getWindow} from './getWindow';
import {isElement} from './is';
import {unwrapElement} from './unwrapElement';

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

  const visualOffsets = getVisualOffsets(
    domElement,
    isFixedStrategy,
    offsetParent
  );

  let x = (clientRect.left + visualOffsets.x) / scale.x;
  let y = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;

  if (domElement) {
    const win = getWindow(domElement);
    const offsetWin =
      offsetParent && isElement(offsetParent)
        ? getWindow(offsetParent)
        : offsetParent;

    let currentIFrame = win.frameElement;
    while (currentIFrame && offsetParent && offsetWin !== win) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = getComputedStyle(currentIFrame);

      iframeRect.x +=
        (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) *
        iframeScale.x;
      iframeRect.y +=
        (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;

      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;

      x += iframeRect.x;
      y += iframeRect.y;

      currentIFrame = getWindow(currentIFrame).frameElement;
    }
  }

  return rectToClientRect({width, height, x, y});
}
