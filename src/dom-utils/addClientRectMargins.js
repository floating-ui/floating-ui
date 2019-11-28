// @flow
import type { Rect } from '../types';
import getElementMargins from './getElementMargins';

export default (rect: Rect, element: HTMLElement): Rect => {
  const margins = getElementMargins(element);

  return {
    width: rect.width + margins.left + margins.right,
    height: rect.height + margins.top + margins.bottom,
    y: rect.y - margins.top,
    x: rect.x - margins.left,
  };
};
