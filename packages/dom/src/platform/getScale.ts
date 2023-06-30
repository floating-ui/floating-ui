import type {Coords} from '@floating-ui/core';

import type {VirtualElement} from '../types';
import {getCssDimensions} from '../utils/getCssDimensions';
import {isHTMLElement} from '../utils/is';
import {createCoords, round} from '../utils/math';
import {unwrapElement} from '../utils/unwrapElement';

export function getScale(element: Element | VirtualElement): Coords {
  const domElement = unwrapElement(element);

  if (!isHTMLElement(domElement)) {
    return createCoords(1);
  }

  const rect = domElement.getBoundingClientRect();
  const {width, height, $} = getCssDimensions(domElement);
  let x = ($ ? round(rect.width) : rect.width) / width;
  let y = ($ ? round(rect.height) : rect.height) / height;

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
