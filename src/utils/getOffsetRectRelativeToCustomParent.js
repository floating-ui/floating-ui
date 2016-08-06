import getBoundingClientRect from './getBoundingClientRect';
import getScrollParent from './getScrollParent';

/**
 * Given an element and one of its parents, return the offset
 * @function
 * @ignore
 * @param {HTMLElement} element
 * @param {HTMLElement} parent
 * @return {Object} rect
 */
export default function getOffsetRectRelativeToCustomParent(element, parent, fixed, transformed) {
    var elementRect = getBoundingClientRect(element);
    var parentRect = getBoundingClientRect(parent);

    if (fixed && !transformed) {
        var scrollParent = getScrollParent(parent);
        parentRect.top += scrollParent.scrollTop;
        parentRect.bottom += scrollParent.scrollTop;
        parentRect.left += scrollParent.scrollLeft;
        parentRect.right += scrollParent.scrollLeft;
    }

    var rect = {
        top: elementRect.top - parentRect.top ,
        left: elementRect.left - parentRect.left ,
        bottom: (elementRect.top - parentRect.top) + elementRect.height,
        right: (elementRect.left - parentRect.left) + elementRect.width,
        width: elementRect.width,
        height: elementRect.height
    };
    return rect;
}
