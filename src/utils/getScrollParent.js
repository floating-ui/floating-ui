import getStyleComputedProperty from './getStyleComputedProperty';

/**
 * Returns the scrolling parent of the given element
 * @function
 * @ignore
 * @argument {Element} element
 * @returns {Element} offset parent
 */
export default function getScrollParent(element) {
    if (element === window.document) {
        // Firefox puts the scrollTOp value on `documentElement` instead of `body`, we then check which of them is
        // greater than 0 and return the proper element
        if (window.document.body.scrollTop) {
            return window.document.body;
        } else {
            return window.document.documentElement;
        }
    }

    // Firefox want us to check `-x` and `-y` variations as well
    if (
        ['scroll', 'auto'].indexOf(getStyleComputedProperty(element, 'overflow')) !== -1 ||
        ['scroll', 'auto'].indexOf(getStyleComputedProperty(element, 'overflow-x')) !== -1 ||
        ['scroll', 'auto'].indexOf(getStyleComputedProperty(element, 'overflow-y')) !== -1
    ) {
        return element;
    }
    return element.parentNode ? getScrollParent(element.parentNode) : element;
}
