import getStyleComputedProperty from './getStyleComputedProperty';

/**
 * Check if the given element is fixed or is inside a fixed parent
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {Element} customContainer
 * @returns {Boolean} answer to "isFixed?"
 */
export default function isFixed(element) {
    if (element === window.document.body) {
        return false;
    }
    if (getStyleComputedProperty(element, 'position') === 'fixed') {
        return true;
    }
    return element.parentNode ? isFixed(element.parentNode) : element;
}
