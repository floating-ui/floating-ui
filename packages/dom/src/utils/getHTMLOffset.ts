import {getComputedStyle} from '@floating-ui/utils/dom';

import type {NodeScroll} from '../types';
import {getWindowScrollBarX} from './getWindowScrollBarX';

export function getHTMLOffset(
  documentElement: HTMLElement,
  scroll: NodeScroll,
) {
  const htmlRect = documentElement.getBoundingClientRect();
  const zoom = parseFloat(getComputedStyle(documentElement).zoom) || 1;
  const x =
    htmlRect.left / zoom +
    scroll.scrollLeft -
    getWindowScrollBarX(documentElement, htmlRect);
  const y = htmlRect.top / zoom + scroll.scrollTop;

  return {
    x,
    y,
  };
}
