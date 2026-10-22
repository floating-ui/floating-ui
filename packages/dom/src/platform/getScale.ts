import type {Coords} from '@floating-ui/core';
import {createCoords, round} from '@floating-ui/utils';
import {isHTMLElement} from '@floating-ui/utils/dom';

import type {VirtualElement} from '../types';
import {getCssDimensions} from '../utils/getCssDimensions';
import {unwrapElement} from '../utils/unwrapElement';

export function getScale(element: Element | VirtualElement): Coords {
  const domElement = unwrapElement(element);

  if (!isHTMLElement(domElement)) {
    return createCoords(1);
  }

  const rect = domElement.getBoundingClientRect();
  const {width, height, $} = getCssDimensions(domElement);
  const x = ($ ? round(rect.width) : rect.width) / width;
  const y = ($ ? round(rect.height) : rect.height) / height;

  // 0, NaN, or Infinity should always fallback to 1.
  return {
    x: x && Number.isFinite(x) ? x : 1,
    y: y && Number.isFinite(y) ? y : 1,
  };
}
