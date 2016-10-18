import getOffsetParent from './getOffsetParent';
import getOffsetRectRelativeToCustomParent from './getOffsetRectRelativeToCustomParent';

/**
 * Get offsets to the popper
 * @method
 * @memberof Popper.Utils
 * @param {Element} popper - the popper element
 * @param {Element} reference - the reference element (the popper will be relative to this)
 * @returns {Object} An object containing the offsets which will be applied to the popper
 */
export default function getOffsets(state, popper, reference) {

    const popperOffsets = {};
    popperOffsets.position = state.position;

    const isParentFixed = popperOffsets.position === 'fixed';
    const isParentTransformed = state.isParentTransformed;

    //
    // Get reference element position
    //
    const offsetParent = getOffsetParent((isParentFixed && isParentTransformed) ? reference : popper);
    const referenceOffsets = getOffsetRectRelativeToCustomParent(reference, offsetParent, isParentFixed, isParentTransformed);

    return {
        reference: referenceOffsets
    };
}
