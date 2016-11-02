import getOffsetParent from './getOffsetParent';
import getOffsetRectRelativeToCustomParent from './getOffsetRectRelativeToCustomParent';
import getOuterSizes from './getOuterSizes';

/**
 * Get offsets to the popper
 * @method
 * @memberof Popper.Utils
 * @param {Element} popper - the popper element
 * @param {Element} reference - the reference element (the popper will be relative to this)
 * @returns {Object} An object containing the offsets which will be applied to the popper
 */
export default function getOffsets(state, popper, reference, placement) {
    placement = placement.split('-')[0];

    const popperOffsets = {};
    popperOffsets.position = state.position;

    const isParentFixed = popperOffsets.position === 'fixed';
    const isParentTransformed = state.isParentTransformed;

    //
    // Get reference element position
    //
    const offsetParent = getOffsetParent((isParentFixed && isParentTransformed) ? reference : popper);
    const referenceOffsets = getOffsetRectRelativeToCustomParent(reference, offsetParent, isParentFixed, isParentTransformed);

    //
    // Get popper sizes
    //
    const popperRect = getOuterSizes(popper);

    //
    // Compute offsets of popper
    //

    // depending by the popper placement we have to compute its offsets slightly differently
    if (['right', 'left'].indexOf(placement) !== -1) {
        popperOffsets.top = referenceOffsets.top + referenceOffsets.height / 2 - popperRect.height / 2;
        if (placement === 'left') {
            popperOffsets.left = referenceOffsets.left - popperRect.width;
        } else {
            popperOffsets.left = referenceOffsets.right;
        }
    } else {
        popperOffsets.left = referenceOffsets.left + referenceOffsets.width / 2 - popperRect.width / 2;
        if (placement === 'top') {
            popperOffsets.top = referenceOffsets.top - popperRect.height;
        } else {
            popperOffsets.top = referenceOffsets.bottom;
        }
    }

    // Add width and height to our offsets object
    popperOffsets.width   = popperRect.width;
    popperOffsets.height  = popperRect.height;


    return {
        popper: popperOffsets,
        reference: referenceOffsets
    };
}
