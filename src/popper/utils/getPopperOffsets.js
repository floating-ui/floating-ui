import getOuterSizes from './getOuterSizes';
import getOppositePlacement from './getOppositePlacement';

/**
 * Get offsets to the popper
 * @method
 * @memberof Popper.Utils
 * @param {Element} popper - the popper element
 * @param {Element} reference - the reference element (the popper will be relative to this)
 * @returns {Object} An object containing the offsets which will be applied to the popper
 */
export default function getPopperOffsets(state, popper, referenceOffsets, placement) {
    placement = placement.split('-')[0];

    // Get popper node sizes
    const popperRect = getOuterSizes(popper);

    // Add position, width and height to our offsets object
    const popperOffsets = {
        position: state.position,
        width: popperRect.width,
        height: popperRect.height,
    };

    // depending by the popper placement we have to compute its offsets slightly differently
    let mainSide, secondarySide, measurement;
    const isHoriz = ['right', 'left'].indexOf(placement) !== -1;
    mainSide = isHoriz ? 'top' : 'left';
    secondarySide = isHoriz ? 'left' : 'top';
    measurement = isHoriz ? 'height' : 'width';

    popperOffsets[mainSide] = referenceOffsets[mainSide] + referenceOffsets[measurement] / 2 - popperRect[measurement] / 2;
    if (placement === secondarySide) {
        popperOffsets[secondarySide] = referenceOffsets[secondarySide] - popperRect[isHoriz ? 'width' : 'height'];
    } else {
        popperOffsets[secondarySide] = referenceOffsets[getOppositePlacement(secondarySide)];
    }

    return popperOffsets;
}
