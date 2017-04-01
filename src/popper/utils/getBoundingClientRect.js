import getStyleComputedProperty from './getStyleComputedProperty';
import getBordersSize from './getBordersSize';

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
        } catch(err) {
            rect = {};
        }
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

    // IE10 FIX: `getBoundingClientRect`, when executed on `documentElement`
    // will not take in account the `scrollTop` and `scrollLeft`
    if (element.nodeName === 'HTML' && isIE10) {
        const { scrollTop, scrollLeft } = window.document.documentElement;
        result.top -= scrollTop;
        result.bottom -= scrollTop;
        result.left -= scrollLeft;
        result.right -= scrollLeft;
    }

    // subtract scrollbar size from sizes
    let horizScrollbar = rect.width - (element.clientWidth || rect.right - rect.left);
    let vertScrollbar = rect.height - (element.clientHeight || rect.bottom - rect.top);

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
