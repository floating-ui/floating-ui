import findCommonOffsetParent from './findCommonOffsetParent';
import getOffsetRectRelativeToArbitraryNode from './getOffsetRectRelativeToArbitraryNode';

/**
 * Get offsets to the reference element
 * @method
 * @memberof Popper.Utils
 * @param {Object} state
 * @param {Element} popper - the popper element
 * @param {Element} reference - the reference element (the popper will be relative to this)
 * @param {Element} fixedParent - force to calc by a specific parent, used by positionFixed mostly
 * @param {Element} ignoreParentScroll - force ignore on parents scroll, used by positionFixed mostly
 * @returns {Object} An object containing the offsets which will be applied to the popper
 */
export default function getReferenceOffsets(state, popper, reference, fixedParent = null) {
  const commonOffsetParent = fixedParent ? window.document.documentElement : findCommonOffsetParent(popper, reference);
  return getOffsetRectRelativeToArbitraryNode(reference, commonOffsetParent, fixedParent);
}
