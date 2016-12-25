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
    if (element === window.document) {
        // Firefox puts the scrollTop value on `documentElement` instead of `body`
        // we can use the `scrollingElement` property if supported, or, we fallback to
        // `documentElement` otherwise
        return document.scrollingElement || document.documentElement;
    }

    // Firefox want us to check `-x` and `-y` variations as well
    if (
        ['scroll', 'auto'].indexOf(getStyleComputedProperty(element, 'overflow')) !== -1 ||
        ['scroll', 'auto'].indexOf(getStyleComputedProperty(element, 'overflow-x')) !== -1 ||
        ['scroll', 'auto'].indexOf(getStyleComputedProperty(element, 'overflow-y')) !== -1
    ) {
        // If the detected scrollParent is body, we perform an additional check on its parentNode
        // in this way we'll get body if the browser is Chrome-ish, or documentElement otherwise
        // fixes issue #65
        return element === window.document.body ? getScrollParent(getParentNode(element)) : element;
    }
    return getParentNode(element) ? getScrollParent(getParentNode(element)) : element;
}
