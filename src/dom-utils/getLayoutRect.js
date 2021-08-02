// @flow
import type { Rect } from '../types';
import getBoundingClientRect from './getBoundingClientRect';

// Returns the layout rect of an element relative to its offsetParent. Layout
// means it doesn't take into account transforms.
export default function getLayoutRect(element: HTMLElement): Rect {
  const clientRect = getBoundingClientRect(element);

  // Use the clientRect sizes if it's not been transformed.
  // Fixes https://github.com/popperjs/popper-core/issues/1223
  let width = element.offsetWidth;
  let height = element.offsetHeight;

  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }

  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }

  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width,
    height,
  };
}
