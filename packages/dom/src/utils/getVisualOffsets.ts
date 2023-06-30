import {getWindow} from './getWindow';
import {isSafari} from './is';
import {createCoords} from './math';

const noOffsets = createCoords(0);

export function getVisualOffsets(
  element: Element | undefined,
  isFixed = true,
  floatingOffsetParent?: Element | Window | undefined
) {
  if (!isSafari()) {
    return noOffsets;
  }

  const win = element ? getWindow(element) : window;

  if (!floatingOffsetParent || (isFixed && floatingOffsetParent !== win)) {
    return noOffsets;
  }

  return {
    x: win.visualViewport?.offsetLeft || 0,
    y: win.visualViewport?.offsetTop || 0,
  };
}
