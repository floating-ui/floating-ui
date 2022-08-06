// @flow
import getWindow from './getWindow';
import getDocumentElement from './getDocumentElement';
import getWindowScrollBarX from './getWindowScrollBarX';
import isLayoutViewport from './isLayoutViewport';
import type { PositioningStrategy } from '../types';

export default function getViewportRect(
  element: Element,
  strategy: PositioningStrategy
) {
  const win = getWindow(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;

  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;

  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;

    const layoutViewport = isLayoutViewport();

    if (layoutViewport || (!layoutViewport && strategy === 'fixed')) {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }

  return {
    width,
    height,
    x: x + getWindowScrollBarX(element),
    y,
  };
}
