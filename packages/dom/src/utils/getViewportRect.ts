import type {Rect, RootBoundary, Strategy} from '@floating-ui/core';
import {getComputedStyle, getWindow, isWebKit} from '@floating-ui/utils/dom';

import {getDocumentElement} from '../platform/getDocumentElement';
import {getWindowScrollBarX} from './getWindowScrollBarX';

// Safety check: ensure the scrollbar space is reasonable in case this
// calculation is affected by unusual styles.
// Most scrollbars leave 15-18px of space.
const SCROLLBAR_MAX = 25;

type ViewportRootBoundary = Extract<
  RootBoundary,
  'viewport' | 'layoutViewport'
>;

export function getViewportRect(
  element: Element,
  strategy: Strategy,
  rootBoundary: ViewportRootBoundary = 'viewport',
): Rect {
  const isLayoutViewport = rootBoundary === 'layoutViewport';
  const win = getWindow(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;

  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;

  if (visualViewport) {
    // Client coordinates are relative to the layout viewport, except in
    // WebKit with an `absolute` strategy, where they are relative to the
    // visual viewport.
    const layoutRelativeClientCoords = !isWebKit() || strategy === 'fixed';

    if (isLayoutViewport) {
      if (!layoutRelativeClientCoords) {
        x = -visualViewport.offsetLeft;
        y = -visualViewport.offsetTop;
      }
    } else {
      width = visualViewport.width;
      height = visualViewport.height;

      if (layoutRelativeClientCoords) {
        x = visualViewport.offsetLeft;
        y = visualViewport.offsetTop;
      }
    }
  }

  const windowScrollbarX = getWindowScrollBarX(html);
  const scrollbarGutter = getComputedStyle(html).scrollbarGutter;
  // `scrollbar-gutter: stable` on the <html> reserves gutter space that shrinks
  // the visual width but isn't reflected in `html.clientWidth`. The <html>
  // border box does reflect it, so measure the reserved space from it. A
  // left-side scrollbar (`windowScrollbarX > 0`) is already handled by
  // `getHTMLOffset`/`visualViewport.width`; skip it here.
  if (windowScrollbarX <= 0 && scrollbarGutter && scrollbarGutter !== 'auto') {
    const reservedWidth = html.clientWidth - html.getBoundingClientRect().width;

    if (reservedWidth > 0 && reservedWidth <= SCROLLBAR_MAX) {
      width -= reservedWidth;
    }
  }

  return {
    width,
    height,
    x,
    y,
  };
}
