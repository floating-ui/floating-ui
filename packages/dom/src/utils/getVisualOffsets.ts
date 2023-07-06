import type {Coords} from '@floating-ui/core';

import {getWindow} from './getWindow';
import {isSafari} from './is';
import {createCoords} from './math';

const noOffsets = createCoords(0);

export function getVisualOffsets(element: Element | undefined): Coords {
  const win = getWindow(element);

  if (!isSafari() || !win.visualViewport) {
    return noOffsets;
  }

  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop,
  };
}

export function shouldAddVisualOffsets(
  element: Element | undefined,
  isFixed = false,
  floatingOffsetParent?: Element | Window | undefined
): boolean {
  if (
    !floatingOffsetParent ||
    (isFixed && floatingOffsetParent !== getWindow(element))
  ) {
    return false;
  }

  return isFixed;
}
