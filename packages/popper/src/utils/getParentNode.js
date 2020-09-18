import getNodeName from './getNodeName';

/**
 * Returns the parentNode or the host of the element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} parent
 */
export default function getParentNode(element) {
  if (getNodeName(element) === 'HTML') {
    return element;
  }
  return element.parentNode || element.host;
}
