import getBoundingClientRect from './getBoundingClientRect';
import getScrollParent from './getScrollParent';
import getScroll from './getScroll';
import getOffsetParent from './getOffsetParent';

/**
 * Given an element and one of its parents, return the offset
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} element
 * @param {HTMLElement} parent
 * @return {Object} rect
 */
export default function getOffsetRectRelativeToCustomParent(element, parent, fixed = false, transformed = false) {
    const scrollParent = getScrollParent(parent);
    const elementRect = getBoundingClientRect(element);
    const parentRect = getBoundingClientRect(parent);

    const rect = {
        top: elementRect.top - parentRect.top,
        left: elementRect.left - parentRect.left,
        bottom: (elementRect.top - parentRect.top) + elementRect.height,
        right: (elementRect.left - parentRect.left) + elementRect.width,
        width: elementRect.width,
        height: elementRect.height,
    };

    if (fixed && !transformed) {
        const scrollTop = getScroll(scrollParent, 'top');
        const scrollLeft = getScroll(scrollParent, 'left');
        rect.top -= scrollTop;
        rect.bottom -= scrollTop;
        rect.left -= scrollLeft;
        rect.right -= scrollLeft;
    } else if (getOffsetParent(element).contains(scrollParent)) {
        const scrollTop = getScroll(parent, 'top');
        const scrollLeft = getScroll(parent, 'left');
        rect.top += scrollTop;
        rect.bottom += scrollTop;
        rect.left += scrollLeft;
        rect.right += scrollLeft;
    }

    return rect;
}
