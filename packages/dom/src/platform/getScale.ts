import type {Coords} from '@floating-ui/core';
import {createCoords, round} from '@floating-ui/utils';
import {isHTMLElement} from '@floating-ui/utils/dom';

import type {VirtualElement} from '../types';
import {getCssDimensions} from '../utils/getCssDimensions';
import {unwrapElement} from '../utils/unwrapElement';
import {getZoom} from '../utils/getZoom';

export function getScale(
  element: Element | VirtualElement | Window,
  floating?: Element,
): Coords {
  const domElement = unwrapElement(element as Element | VirtualElement);

  if (!isHTMLElement(domElement)) {
    // A `Window` offsetParent still positions in the floating element's own
    // CSS-zoom space, so overflow amounts must be divided by that zoom.
    return createCoords(floating ? getZoom(floating) : 1);
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
