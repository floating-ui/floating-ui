import type {Rect, RootBoundary, Strategy} from '@floating-ui/core';
import {getWindow, isWebKit} from '@floating-ui/utils/dom';

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
  // With `overflow: hidden` + `scrollbar-gutter: stable` on the <html>, the
  // reserved gutter reduces the visual width but is not reflected in
  // `html.clientWidth`, so subtract it. This only applies when the gutter is
  // on the inline-end (right) edge, i.e. there is no left-side scrollbar. A
  // left-side scrollbar (`windowScrollbarX > 0`) is already excluded from
  // `visualViewport.width` and accounted for by `getHTMLOffset`, so it needs
  // no adjustment here — adding it back would push the right edge (and the
  // floating element) past the viewport.
  if (windowScrollbarX <= 0) {
    const doc = html.ownerDocument;
    const body = doc.body;
    const bodyStyles = getComputedStyle(body);
    const bodyMarginInline =
      doc.compatMode === 'CSS1Compat'
        ? parseFloat(bodyStyles.marginLeft) +
            parseFloat(bodyStyles.marginRight) || 0
        : 0;
    const clippingStableScrollbarWidth = Math.abs(
      html.clientWidth - body.clientWidth - bodyMarginInline,
    );

    if (clippingStableScrollbarWidth <= SCROLLBAR_MAX) {
      width -= clippingStableScrollbarWidth;
    }
  }

  return {
    width,
    height,
    x,
    y,
  };
}
