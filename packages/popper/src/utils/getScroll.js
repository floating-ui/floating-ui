/**
 * Gets the scroll value of the given element in the given side (top and left)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {String} side `top` or `left`
 * @returns {number} amount of scrolled pixels
 */
export default function getScroll(element, side = 'top') {
  if (['BODY', 'HTML'].indexOf(element.nodeName) !== -1) {
    element = document.scrollingElement || document.documentElement;
  }

  return !side ? element : element[side === 'top' ? 'scrollTop' : 'scrollLeft'];
}
