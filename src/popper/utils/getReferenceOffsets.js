import getOffsetParent from './getOffsetParent';
import getOffsetRectRelativeToCustomParent from './getOffsetRectRelativeToCustomParent';

/**
 * Get offsets to the reference element
 * @method
 * @memberof Popper.Utils
 * @param {Object} state
 * @param {Element} popper - the popper element
 * @param {Element} reference - the reference element (the popper will be relative to this)
 * @returns {Object} An object containing the offsets which will be applied to the popper
 */
export default function getReferenceOffsets(state, popper, reference) {
    const isParentFixed = state.position === 'fixed';
    const isParentTransformed = state.isParentTransformed;
    const offsetParent = getOffsetParent((isParentFixed && isParentTransformed) ? reference : popper);

    return getOffsetRectRelativeToCustomParent(reference, offsetParent, isParentFixed, isParentTransformed);
}
