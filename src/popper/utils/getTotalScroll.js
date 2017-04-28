import getScrollParent from './getScrollParent';
import getScroll from './getScroll';
import getParentNode from './getParentNode';
import isOffsetContainer from './isOffsetContainer';
import isFixed from './isFixed';

/**
 * Gets the scroll value of the given element relative to the given parent.<br />
 * It will not include the scroll values of elements that aren't positioned.
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {Element} parent
 * @argument {String} side `top` or `left`
 * @returns {number} amount of scrolled pixels
 */
export default function getTotalScroll(element, parent, side = 'top') {
  const scrollParent = getScrollParent(element);
  let scroll = 0;
  const isParentFixed = isFixed(parent);

  // NOTE: I'm not sure the second line of this check is completely correct, review it if
  // someone complains about viewport problems in future
  if (
    isOffsetContainer(
      scrollParent.nodeName === 'BODY'
        ? window.document.documentElement
        : scrollParent
    ) &&
    ((parent.contains(scrollParent) && isParentFixed) || !isParentFixed)
  ) {
    scroll = getScroll(scrollParent, side);
  }

  if (
    parent === scrollParent ||
    ['BODY', 'HTML'].indexOf(scrollParent.nodeName) === -1
  ) {
    return scroll + getTotalScroll(getParentNode(scrollParent), parent, side);
  }
  return scroll;
}
