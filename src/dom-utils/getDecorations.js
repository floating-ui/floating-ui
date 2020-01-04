// @flow
import type { SideObject } from '../types';
import getBorders from './getBorders';

// Borders + scrollbars
export default function getDecorations(element: HTMLElement): SideObject {
  const borders = getBorders(element);

  return {
    top: borders.top,
    right: element.offsetWidth - (element.clientWidth + borders.right),
    bottom: element.offsetHeight - (element.clientHeight + borders.bottom),
    left: borders.left,
  };
}
