/**
 * Get bounding client rect of given element
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} element
 * @return {Object} client rect
 */
export default function getBoundingClientRect(element) {
    let rect = element.getBoundingClientRect();

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
    if (element.nodeName === 'HTML' && navigator.appVersion.indexOf('MSIE 10') !== -1) {
        const { scrollTop, scrollLeft } = window.document.documentElement;
        result.top -= scrollTop;
        result.bottom -= scrollTop;
        result.left -= scrollLeft;
        result.right -= scrollLeft;
    }

    // subtract scrollbar size from sizes
    const horizScrollbar = rect.width - (element.clientWidth || rect.right - rect.left);
    const vertScrollbar = rect.height - (element.clientHeight || rect.bottom - rect.top);

    result.right -= horizScrollbar;
    result.width -= horizScrollbar;
    result.bottom -= vertScrollbar;
    result.height -= vertScrollbar;

    return result;
}
