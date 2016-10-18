import getOffsetParent from './getOffsetParent';
import isFixed from './isFixed';

/**
 * Helper used to get the position which will be applied to the popper
 * @method
 * @memberof Popper.Utils
 * @param config {HTMLElement} popper element
 * @returns {HTMLElement} reference element
 */
export default function getPosition(popper, reference) {
    const container = getOffsetParent(reference);

    // Decide if the popper will be fixed
    // If the reference element is inside a fixed context, the popper will be fixed as well to allow them to scroll together
    const isParentFixed = isFixed(container);
    return isParentFixed ? 'fixed' : 'absolute';
}
