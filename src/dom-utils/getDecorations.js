// @flow
import type { SideObject } from '../types';
import getBorders from './getBorders';
import getNodeName from './getNodeName';
import getWindow from './getWindow';
import getWindowScrollBarX from './getWindowScrollBarX';

// Borders + scrollbars
export default function getDecorations(element: HTMLElement): SideObject {
  const win = getWindow(element);
  const borders = getBorders(element);
  const isHTML = getNodeName(element) === 'html';
  const winScrollBarX = getWindowScrollBarX(element);

  const x = element.clientWidth + borders.right;
  let y = element.clientHeight + borders.bottom;

  // HACK:
  // document.documentElement.clientHeight on iOS reports the height of the
  // viewport including the bottom bar, even if the bottom bar isn't visible.
  // If the difference between window innerHeight and html clientHeight is more
  // than 50, we assume it's a mobile bottom bar and ignore scrollbars.
  // * A 50px thick scrollbar is likely non-existent (macOS is 15px and Windows
  //   is about 17px)
  // * The mobile bar is 114px tall
  if (isHTML && win.innerHeight - element.clientHeight > 50) {
    y = win.innerHeight - borders.bottom;
  }

  return {
    top: isHTML ? 0 : element.clientTop,
    right:
      // RTL scrollbar (scrolling containers only)
      element.clientLeft > borders.left
        ? borders.right
        : // LTR scrollbar
        isHTML
        ? win.innerWidth - x - winScrollBarX
        : element.offsetWidth - x,
    bottom: isHTML ? win.innerHeight - y : element.offsetHeight - y,
    left: isHTML ? winScrollBarX : element.clientLeft,
  };
}
