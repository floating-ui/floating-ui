import getStyleComputedProperty from './getStyleComputedProperty';
import includeScroll from './includeScroll';
import getScrollParent from './getScrollParent';
import getBoundingClientRect from './getBoundingClientRect';
import runIsIE10 from './isIE10';
import getClientRect from './getClientRect';

export default function getOffsetRectRelativeToArbitraryNode(children, parent) {
  const isIE10 = runIsIE10();
  const isHTML = parent.nodeName === 'HTML';
  const childrenRect = getBoundingClientRect(children);
  const parentRect = getBoundingClientRect(parent);
  const scrollParent = getScrollParent(children);
  let offsets = getClientRect({
    top: childrenRect.top - parentRect.top,
    left: childrenRect.left - parentRect.left,
    width: childrenRect.width,
    height: childrenRect.height,
  });

  // Subtract margins of documentElement in case it's being used as parent
  // we do this only on HTML because it's the only element that behaves
  // differently when margins are applied to it. The margins are included in
  // the box of the documentElement, in the other cases not.
  if (isHTML || parent.nodeName === 'BODY') {
    const styles = getStyleComputedProperty(parent);
    const borderTopWidth = isIE10 && isHTML
      ? 0
      : +styles.borderTopWidth.split('px')[0];
    const borderLeftWidth = isIE10 && isHTML
      ? 0
      : +styles.borderLeftWidth.split('px')[0];
    const marginTop = isIE10 && isHTML ? 0 : +styles.marginTop.split('px')[0];
    const marginLeft = isIE10 && isHTML ? 0 : +styles.marginLeft.split('px')[0];

    offsets.top -= borderTopWidth - marginTop;
    offsets.bottom -= borderTopWidth - marginTop;
    offsets.left -= borderLeftWidth - marginLeft;
    offsets.right -= borderLeftWidth - marginLeft;

    // Attach marginTop and marginLeft because in some circumstances we may need them
    offsets.marginTop = marginTop;
    offsets.marginLeft = marginLeft;
  }

  if (
    parent.contains(scrollParent) &&
    (isIE10 || scrollParent.nodeName !== 'BODY')
  ) {
    offsets = includeScroll(offsets, parent);
  }

  return offsets;
}
