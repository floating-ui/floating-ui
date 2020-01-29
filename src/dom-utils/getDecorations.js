// @flow
import type { SideObject } from '../types';
import getBorders from './getBorders';
import getNodeName from './getNodeName';
import getWindow from './getWindow';

// Borders + scrollbars
export default function getDecorations(element: HTMLElement): SideObject {
  const win = getWindow(element);
  const borders = getBorders(element);
  const isHTML = getNodeName(element) === 'html';

  const x = element.clientWidth + borders.right;
  const y = element.clientHeight + borders.bottom;

  return {
    top: element.clientTop,
    right:
      // RTL scrollbar
      element.clientLeft > borders.left
        ? borders.right
        : // LTR scrollbar
        isHTML
        ? win.innerWidth - x
        : element.offsetWidth - x,
    bottom: isHTML ? win.innerHeight - y : element.offsetHeight - y,
    left: element.clientLeft,
  };
}
