import type {Coords} from '@floating-ui/core';
import type {VirtualElement} from '../types';
import {getComputedStyle} from './getComputedStyle';
import {isElement, isHTMLElement} from './is';
import {round} from './math';

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

  // Fallback to the old technique because we'd need to take into account the
  // padding and border. This is usually globally set (and is a better default),
  // so if there are issues with scale transforms, the user can set it manually.
  if (css.boxSizing !== 'border-box') {
    if (!isHTMLElement(element)) {
      return FALLBACK_SCALE;
    }

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
