import getBoundingClientRect from './getBoundingClientRect';
import getScrollParent from './getScrollParent';
import getScroll from './getScroll';
import getOffsetParent from './getOffsetParent';
import getStyleComputedProperty from './getStyleComputedProperty';

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

    // subtract borderTopWidth and borderTopWidth from final result
    const styles = getStyleComputedProperty(parent);
    const borderTopWidth = Number(styles.borderTopWidth.split('px')[0]);
    const borderLeftWidth = Number(styles.borderLeftWidth.split('px')[0]);

    rect.top -= borderTopWidth;
    rect.bottom -= borderTopWidth;
    rect.left -= borderLeftWidth;
    rect.right -= borderLeftWidth;

    return rect;
}
