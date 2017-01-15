import getStyleComputedProperty from './getStyleComputedProperty';
import getParentNode from './getParentNode';

/**
 * Check if the given element has transforms applied to itself or a parent
 * @method
 * @memberof Popper.Utils
 * @param  {Element} element
 * @return {Boolean} answer to "isTransformed?"
 */
export default function isTransformed(element) {
    if (element.nodeName === 'BODY') {
        return false;
    }
    if (getStyleComputedProperty(element, 'transform') !== 'none') {
        return true;
    }
    return getParentNode(element) ? isTransformed(getParentNode(element)) : element;
}
