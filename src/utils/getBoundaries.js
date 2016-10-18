import getOffsetParent from './getOffsetParent';
import getScrollParent from './getScrollParent';
import getOffsetRect from './getOffsetRect';
import getStyleComputedProperty from './getStyleComputedProperty';

/**
 * Computed the boundaries limits and return them
 * @method
 * @memberof Popper.Utils
 * @param {Number} padding - Boundaries padding
 * @param {Element} boundariesElement - Element used to define the boundaries
 * @returns {Object} Coordinates of the boundaries
 */
export default function getBoundaries(popper, padding, boundariesElement) {
    // NOTE: 1 DOM access here
    let boundaries = {};
    if (boundariesElement === 'window') {
        const body = window.document.body;
        const html = window.document.documentElement;
        const height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
        const width = Math.max( body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth );

        boundaries = {
            top: 0,
            right: width,
            bottom: height,
            left: 0
        };
    } else if (boundariesElement === 'viewport') {
        const offsetParent = getOffsetParent(popper);
        const scrollParent = getScrollParent(popper);
        const offsetParentRect = getOffsetRect(offsetParent);

        // if the popper is fixed we don't have to substract scrolling from the boundaries
        const popperPosition = getStyleComputedProperty(popper, 'position');
        const scrollTop = popperPosition === 'fixed' ? 0 : scrollParent.scrollTop;
        const scrollLeft = popperPosition === 'fixed' ? 0 : scrollParent.scrollLeft;

        boundaries = {
            top: 0 - (offsetParentRect.top - scrollTop),
            right: window.document.documentElement.clientWidth - (offsetParentRect.left - scrollLeft),
            bottom: window.document.documentElement.clientHeight - (offsetParentRect.top - scrollTop),
            left: 0 - (offsetParentRect.left - scrollLeft)
        };
    } else {
        if (getOffsetParent(popper) === boundariesElement) {
            boundaries = {
                top: 0,
                left: 0,
                right: boundariesElement.clientWidth,
                bottom: boundariesElement.clientHeight
            };
        } else {
            boundaries = getOffsetRect(boundariesElement);
        }
    }
    boundaries.left += padding;
    boundaries.right -= padding;
    boundaries.top = boundaries.top + padding;
    boundaries.bottom = boundaries.bottom - padding;
    return boundaries;
}
