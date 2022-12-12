import type {Coords} from '@floating-ui/core';
import type {VirtualElement} from '../types';
import {getComputedStyle} from './getComputedStyle';
import {isElement} from './is';

export const FALLBACK_SCALE = {x: 1, y: 1};

export function getScale(element: Element | VirtualElement): Coords {
  const domElement =
    !isElement(element) && element.contextElement
      ? element.contextElement
      : isElement(element)
      ? element
      : null;

  if (!domElement) {
    return FALLBACK_SCALE;
  }

  const rect = domElement.getBoundingClientRect();
  const css = getComputedStyle(domElement);

  let x = rect.width / parseFloat(css.width);
  let y = rect.height / parseFloat(css.height);

  // 0, NaN, or Infinity should always fallback to 1.

  if (!x || !Number.isFinite(x)) {
    x = 1;
  }

  if (!y || !Number.isFinite(y)) {
    y = 1;
  }

  return {
    x,
    y,
  };
}
