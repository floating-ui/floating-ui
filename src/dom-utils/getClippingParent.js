// @flow
import getScrollParent from './getScrollParent';
import getOffsetParent from './getOffsetParent';
import getParentNode from './getParentNode';
import getWindow from './getWindow';

// A "clipping parent" is a scrolling container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from `initial`
export default function getClippingParent(element: HTMLElement): HTMLElement {
  const scrollParent = getScrollParent(element);
  const offsetParent = getOffsetParent(element);
  const win = getWindow(element);

  return offsetParent === win
    ? element.ownerDocument.documentElement
    : scrollParent.contains(offsetParent)
    ? scrollParent
    : getClippingParent(getScrollParent(getParentNode(scrollParent)));
}
