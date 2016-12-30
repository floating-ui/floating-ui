import getStyleComputedProperty from './getStyleComputedProperty';
import getParentNode from './getParentNode';

/**
 * Returns the scrolling parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} offset parent
 */
export default function getScrollParent(element) {
    // Return body, `getScroll` will take care to get the correct `scrollTop` from it
    if (
        element.nodeName === 'HTML' ||
        element.nodeName === 'BODY' ||
        element.nodeName === '#document'
    ) {
        return window.document.body;
    }

    // Firefox want us to check `-x` and `-y` variations as well
    const { overflow, overflowX, overflowY } = getStyleComputedProperty(element);
    if (/(auto|scroll)/.test(overflow + overflowY + overflowX)) {
        return element;
    }

    return getScrollParent(getParentNode(element));
}
