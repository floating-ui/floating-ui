/**
 * Returns the parentNode or the host of the element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} parent
 */
export default function getParentNode(element) {
    const parentNode = element.parentNode || element.host;
    return (parentNode === window.document) ? window.document.documentElement : parentNode;
}
