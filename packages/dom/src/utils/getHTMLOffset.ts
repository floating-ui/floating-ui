import type {NodeScroll} from '../types';
import {getWindowScrollBarX} from './getWindowScrollBarX';

export function getHTMLOffset(
  documentElement: HTMLElement,
  scroll: NodeScroll,
) {
  const htmlRect = documentElement.getBoundingClientRect();
  const x =
    htmlRect.left +
    scroll.scrollLeft -
    getWindowScrollBarX(documentElement, htmlRect);
  const y = htmlRect.top + scroll.scrollTop;

  return {
    x,
    y,
  };
}
