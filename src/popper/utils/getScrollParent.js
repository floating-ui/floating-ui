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
    if (
        ['scroll', 'auto'].indexOf(getStyleComputedProperty(element, 'overflow')) !== -1 ||
        ['scroll', 'auto'].indexOf(getStyleComputedProperty(element, 'overflow-x')) !== -1 ||
        ['scroll', 'auto'].indexOf(getStyleComputedProperty(element, 'overflow-y')) !== -1
    ) {
        return element;
    }

    return getScrollParent(getParentNode(element));
}
