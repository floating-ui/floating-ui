import getOffsetParent from './getOffsetParent';
import isFixed from './isFixed';

/**
 * Helper used to get the position which will be applied to the popper
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} element - popper element
 * @returns {String} position
 */
export default function getPosition(element) {
    const container = getOffsetParent(element);

    // Decide if the popper will be fixed
    // If the reference element is inside a fixed context, the popper will be fixed as well to allow them to scroll together
    const isParentFixed = isFixed(container);
    return isParentFixed ? 'fixed' : 'absolute';
}
