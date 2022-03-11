import type {Rect, Strategy} from '@floating-ui/core';
import {getWindow} from './window';
import {getDocumentElement} from './getDocumentElement';
import {isLayoutViewport} from './is';

export function getViewportRect(element: Element, strategy: Strategy): Rect {
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

  return {width, height, x, y};
}
