// @flow
import type { Rect } from '../types';
import getCompositeRect from './getCompositeRect';
import getWindow from './getWindow';
import getDocumentElement from './getDocumentElement';
import getWindowScroll from './getWindowScroll';

export default function getDocumentRect(element: HTMLElement): Rect {
  const win = getWindow(element);
  const winScroll = getWindowScroll(element);
  const documentRect = getCompositeRect(getDocumentElement(element), win);

  documentRect.height = Math.max(documentRect.height, win.innerHeight);
  documentRect.width = Math.max(documentRect.width, win.innerWidth);
  documentRect.x = -winScroll.scrollLeft;
  documentRect.y = -winScroll.scrollTop;

  return documentRect;
}
