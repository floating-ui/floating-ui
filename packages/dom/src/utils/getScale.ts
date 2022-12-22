import type {Coords} from '@floating-ui/core';
import type {VirtualElement} from '../types';
import {getCssDimensions} from './getCssDimensions';
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
  const {width, height, fallback} = getCssDimensions(domElement);

  let x = rect.width / width;
  let y = rect.height / height;

  // • cssWidth/cssHeight can be 'auto' for inline offsetParents, so the
  // values can be `NaN`.
  // • If the offset dimension is more than half a pixel different from the
  // computed dimension, it's either a `content-box` box-sizing, or something
  // else has gone wrong, so fallback.
  if (fallback) {
    x = round(rect.width) / domElement.offsetWidth;
    y = round(rect.height) / domElement.offsetHeight;
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
