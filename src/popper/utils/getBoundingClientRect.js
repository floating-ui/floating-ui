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
    let result;
    if (element.nodeName === 'HTML') {
        const { width, height } = getWindowSizes();
        result = {
            left: 0,
            top: 0,
            right: width,
            bottom: height,
            width,
            height,
        };

        const scrollTop = getScroll(element, 'top');
        const scrollLeft = getScroll(element, 'left');
        result.top -= scrollTop;
        result.bottom -= scrollTop;
        result.left -= scrollLeft;
        result.right -= scrollLeft;
    } else {
        const isIE10 = navigator.appVersion.indexOf('MSIE 10') !== -1;
        let rect;

        // IE10 10 FIX: Please, don't ask, the element isn't
        // considered in DOM in some circumstances...
        // This isn't reproducible in IE10 compatibility mode of IE11
        if (isIE10) {
            try {
                rect = element.getBoundingClientRect();
            } catch(err) {
                rect = {};
            }
        } else {
            rect = element.getBoundingClientRect();
        }

        result = {
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            width: rect.right - rect.left,
            height: rect.bottom - rect.top,
        };
    }

    // subtract scrollbar size from sizes
    let horizScrollbar = result.width - (element.clientWidth || result.right - result.left);
    let vertScrollbar = result.height - (element.clientHeight || result.bottom - result.top);

    // if an hypothetical scrollbar is detected, we must be sure it's not a `border`
    // we make this check conditional for performance reasons
    if (horizScrollbar || vertScrollbar) {
        const styles = getStyleComputedProperty(element);
        horizScrollbar -= getBordersSize(styles, 'x');
        vertScrollbar -= getBordersSize(styles, 'y');
    }

    result.right -= horizScrollbar;
    result.width -= horizScrollbar;
    result.bottom -= vertScrollbar;
    result.height -= vertScrollbar;

    return result;
}
