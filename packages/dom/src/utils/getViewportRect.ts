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

  const htmlRect = html.getBoundingClientRect();
  const windowScrollbarX = getWindowScrollBarX(html, htmlRect);
  // `scrollbar-gutter: stable` on the <html> reserves gutter space that shrinks
  // the visual width. In standards mode, only the border box reflects it. In
  // quirks mode, `html.clientWidth` also shrinks, so compare it with the chosen
  // viewport width instead. A left-side scrollbar (`windowScrollbarX > 0`) is
  // already handled by `getHTMLOffset`/`visualViewport.width`; skip it here.
  // `both-edges` also shifts the <html> origin by the inline-start gutter, so it
  // fails that same check and stays uncorrected.
  const reservedWidth =
    win.document.compatMode === 'BackCompat'
      ? width - html.clientWidth
      : html.clientWidth - htmlRect.width;

  if (
    windowScrollbarX <= 0 &&
    reservedWidth > 0 &&
    reservedWidth <= SCROLLBAR_MAX
  ) {
    // Only a declared gutter reserves space; any other narrowing of the <html>
    // box (a margin, a width, a transform) must not be treated as one. Read
    // last so the style lookup stays off the common path.
    const scrollbarGutter = getComputedStyle(html).scrollbarGutter;

    if (scrollbarGutter && scrollbarGutter !== 'auto') {
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
