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

  let width = parseFloat(css.width);
  let height = parseFloat(css.height);

  if (css.boxSizing !== 'border-box') {
    const pl = parseFloat(css.paddingLeft);
    const pr = parseFloat(css.paddingRight);
    const pt = parseFloat(css.paddingTop);
    const pb = parseFloat(css.paddingBottom);
    const bl = parseFloat(css.borderLeftWidth);
    const br = parseFloat(css.borderRightWidth);
    const bt = parseFloat(css.borderTopWidth);
    const bb = parseFloat(css.borderBottomWidth);
    width += pl + pr + bl + br;
    height += pt + pb + bt + bb;
  }

  let x = rect.width / width;
  let y = rect.height / height;

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
