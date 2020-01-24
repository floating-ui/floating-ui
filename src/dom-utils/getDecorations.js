// @flow
import type { SideObject } from '../types';
import getBorders from './getBorders';
import getNodeName from './getNodeName';
import getWindow from './getWindow';

// Borders + scrollbars
export default function getDecorations(element: HTMLElement): SideObject {
  const borders = getBorders(element);
  const win = getWindow(element);

  let right = element.offsetWidth - element.clientWidth - borders.right;
  let bottom = element.offsetHeight - element.clientHeight - borders.bottom;

  if (getNodeName(element) === 'html') {
    right = win.innerWidth - element.clientWidth;
    bottom = win.innerHeight - element.clientHeight;
  }

  return {
    top: borders.top,
    right,
    bottom,
    left: borders.left,
  };
}
