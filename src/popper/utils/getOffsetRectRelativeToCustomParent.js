import getBoundingClientRect from './getBoundingClientRect';
import getScrollParent from './getScrollParent';
import includeScroll from './includeScroll';
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

    let rect = {
        top: elementRect.top - parentRect.top,
        left: elementRect.left - parentRect.left,
        bottom: (elementRect.top - parentRect.top) + elementRect.height,
        right: (elementRect.left - parentRect.left) + elementRect.width,
        width: elementRect.width,
        height: elementRect.height,
    };

    if (fixed && !transformed) {
        rect = includeScroll(rect, scrollParent, true)
    }
    // When a popper doesn't have any positioned or scrollable parents, `offsetParent.contains(scrollParent)`
    // will return a "false positive". This is happening because `getOffsetParent` returns `html` node,
    // and `scrollParent` is the `body` node. Hence the additional check.
    else if (getOffsetParent(element).contains(scrollParent) && scrollParent.nodeName !== 'BODY') {
        rect = includeScroll(rect, parent)
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
