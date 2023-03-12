import type {Dimensions} from '@floating-ui/core';

import {getComputedStyle} from './getComputedStyle';
import {isHTMLElement} from './is';
import {round} from './math';

export function getCssDimensions(
  element: Element
): Dimensions & {fallback: boolean} {
  const css = getComputedStyle(element);
  let width = parseFloat(css.width);
  let height = parseFloat(css.height);
  const hasOffset = isHTMLElement(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback =
    round(width) !== offsetWidth || round(height) !== offsetHeight;

  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }

  return {
    width,
    height,
    fallback: shouldFallback,
  };
}
