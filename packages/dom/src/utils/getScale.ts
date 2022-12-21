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

  if (!isHTMLElement(domElement)) {
    return FALLBACK_SCALE;
  }

  const rect = domElement.getBoundingClientRect();
  const css = getComputedStyle(domElement);
  const cssWidth = parseFloat(css.width);
  const cssHeight = parseFloat(css.height);
  const offsetWidth = domElement.offsetWidth;
  const offsetHeight = domElement.offsetHeight;

  let x = rect.width / cssWidth;
  let y = rect.height / cssHeight;

  // • cssWidth/cssHeight can be 'auto' for inline offsetParents, so the
  // values can be `NaN`.
  // • If the offset dimension is more than half a pixel different from the
  // computed dimension, it's either a `content-box` box-sizing, or something
  // else has gone wrong, so fallback.
  if (round(cssWidth) !== offsetWidth || round(cssHeight) !== offsetHeight) {
    x = round(rect.width) / offsetWidth;
    y = round(rect.height) / offsetHeight;
  }

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
