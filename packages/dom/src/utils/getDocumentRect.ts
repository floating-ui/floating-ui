import type {Rect} from '@floating-ui/core';

import {getComputedStyle} from './getComputedStyle';
import {getDocumentElement} from './getDocumentElement';
import {getNodeScroll} from './getNodeScroll';
import {getWindowScrollBarX} from './getWindowScrollBarX';
import {max} from './math';

// Gets the entire size of the scrollable document area, even extending outside
// of the `<html>` and `<body>` rect bounds if horizontally scrollable.
export function getDocumentRect(element: HTMLElement): Rect {
  const html = getDocumentElement(element);
  const scroll = getNodeScroll(element);
  const body = element.ownerDocument.body;

  const width = max(
    html.scrollWidth,
    html.clientWidth,
    body.scrollWidth,
    body.clientWidth
  );
  const height = max(
    html.scrollHeight,
    html.clientHeight,
    body.scrollHeight,
    body.clientHeight
  );

  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y = -scroll.scrollTop;

  if (getComputedStyle(body).direction === 'rtl') {
    x += max(html.clientWidth, body.clientWidth) - width;
  }

  return {
    width,
    height,
    x,
    y,
  };
}
