import {getWindow} from './getWindow';
import {isSafari} from './is';
import {createCoords} from './math';

const noOffsets = createCoords(0);

export function getVisualOffsets(element: Element | undefined) {
  if (!isSafari()) {
    return noOffsets;
  }

  const win = getWindow(element);

  return {
    x: win.visualViewport?.offsetLeft || 0,
    y: win.visualViewport?.offsetTop || 0,
  };
}

export function shouldAddVisualOffsets(
  element: Element | undefined,
  isFixed = false,
  floatingOffsetParent?: Element | Window | undefined
) {
  const win = getWindow(element);

  if (!floatingOffsetParent || (isFixed && floatingOffsetParent !== win)) {
    return false;
  }

  return isFixed;
}
