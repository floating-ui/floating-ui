import getStyleComputedProperty from './getStyleComputedProperty';

/**
 * Check if the given element has transforms applied to itself or a parent
 * @method
 * @memberof Popper.Utils
 * @param  {Element} element
 * @return {Boolean} answer to "isTransformed?"
 */
export default function isTransformed(element) {
  if (element === window.document.body) {
      return false;
  }
  if (getStyleComputedProperty(element, 'transform') !== 'none') {
      return true;
  }
  return element.parentNode ? isTransformed(element.parentNode) : element;
}
