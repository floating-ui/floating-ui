// @flow
import getWindow from './getWindow';
import type { Window } from '../types';

export default function getWindowScroll(node: Node | Window): {
  scrollLeft: number,
  scrollTop: number,
} {
  const win = getWindow(node);
  const scrollLeft = win.pageXOffset;
  const scrollTop = win.pageYOffset;

  return {
    scrollLeft,
    scrollTop,
  };
}
