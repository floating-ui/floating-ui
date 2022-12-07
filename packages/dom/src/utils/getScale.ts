import type {Coords, Rect} from '@floating-ui/core';
import {round} from './math';

export function getScale(element: HTMLElement, paramRect?: Rect): Coords {
  const rect = paramRect || element.getBoundingClientRect();
  return {
    x:
      element.offsetWidth > 0
        ? round(rect.width) / element.offsetWidth || 1
        : 1,
    y:
      element.offsetHeight > 0
        ? round(rect.height) / element.offsetHeight || 1
        : 1,
  };
}
