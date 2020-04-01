// @flow
import getWindow from './getWindow';
import type { VirtualElement } from '../types';

export default function getViewportRect(element: Element | VirtualElement) {
  const win = getWindow(element);

  return {
    width: win.innerWidth,
    height: win.innerHeight,
    x: 0,
    y: 0,
  };
}
