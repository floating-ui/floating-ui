/**
 * Returns the parentNode or the host of the element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} parent
 */
export default function getParentNode(element) {
  return element.nodeName === 'HTML'
    ? element
    : element.parentNode || element.host;
}
