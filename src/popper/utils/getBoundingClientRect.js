import getStyleComputedProperty from './getStyleComputedProperty';
import getBordersSize from './getBordersSize';
import getWindowSizes from './getWindowSizes';
import getScroll from './getScroll';

/**
 * Get bounding client rect of given element
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} element
 * @return {Object} client rect
 */
export default function getBoundingClientRect(element) {
  const isIE10 = navigator.appVersion.indexOf('MSIE 10') !== -1;
  let rect;

  // IE10 10 FIX: Please, don't ask, the element isn't
  // considered in DOM in some circumstances...
  // This isn't reproducible in IE10 compatibility mode of IE11
  if (isIE10) {
    try {
      rect = element.getBoundingClientRect();
    } catch (err) {
      rect = {};
    }
    const scrollTop = getScroll(element, 'top');
    const scrollLeft = getScroll(element, 'left');
    rect.top += scrollTop;
    rect.bottom += scrollTop;
    rect.left += scrollLeft;
    rect.right += scrollLeft;
  } else {
    rect = element.getBoundingClientRect();
  }

  const result = {
    left: rect.left,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.right - rect.left,
    height: rect.bottom - rect.top,
  };

  // subtract scrollbar size from sizes
  let width, height;
  if (element.nodeName === 'HTML') {
    const sizes = getWindowSizes();
    width = sizes.width;
    height = sizes.height;
  } else {
    width = element.clientWidth || result.right - result.left;
    height = element.clientHeight || result.bottom - result.top;
  }
  let horizScrollbar = result.width - width;
  let vertScrollbar = result.height - height;

  // if an hypothetical scrollbar is detected, we must be sure it's not a `border`
  // we make this check conditional for performance reasons
  if (horizScrollbar || vertScrollbar) {
    const styles = getStyleComputedProperty(element);
    horizScrollbar -= getBordersSize(styles, 'x');
    vertScrollbar -= getBordersSize(styles, 'y');

    result.right -= horizScrollbar;
    result.width -= horizScrollbar;
    result.bottom -= vertScrollbar;
    result.height -= vertScrollbar;
  }

  return result;
}
