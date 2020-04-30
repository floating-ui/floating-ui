// @flow
import type { Rect } from '../types';
import getDocumentElement from './getDocumentElement';
import getWindowScroll from './getWindowScroll';

export default function getDocumentRect(element: HTMLElement): Rect {
  const winScroll = getWindowScroll(element);
  const html = getDocumentElement(element);
  const body = element.ownerDocument.body;

  const width = Math.max(html.clientWidth, body ? body.clientWidth : 0);
  const height = Math.max(html.clientHeight, body ? body.clientHeight : 0);
  const x = -winScroll.scrollLeft;
  const y = -winScroll.scrollTop;

  return { width, height, x, y };
}
