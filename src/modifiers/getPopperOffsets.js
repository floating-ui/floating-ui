import getOuterSizes from '../utils/getOuterSizes';

export default function getPopperOffsets(data) {

    const placement = data.placement;
    const referenceOffsets = data.offsets.reference;
    const popper = data.instance.popper;

    //
    // Get popper sizes
    //
    const popperOffsets = {};
    popperOffsets.position = data.instance.state.position;

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

    data.offsets.popper = popperOffsets;

    return data;
};
