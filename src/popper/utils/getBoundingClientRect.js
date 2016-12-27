/**
 * Get bounding client rect of given element
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} element
 * @return {Object} client rect
 */
export default function getBoundingClientRect(element) {
    let rect;

    // IE10 FIX: `getBoundingClientRect`, when executed on `documentElement`
    // will not take in account the `scrollTop` and `scrollLeft`,
    // use `body` instead to avoid these problems (only in IE10!)
    if (element === window.document.documentElement && navigator.appVersion.indexOf('MSIE 10') !== -1) {
        rect = window.document.body.getBoundingClientRect();
    } else {
        rect = element.getBoundingClientRect();
    }

    // subtract scrollbar size from sizes
    const horizScrollbar = element.offsetWidth - element.clientWidth;
    const vertScrollbar = element.offsetHeight - element.clientHeight;

    return {
        left: rect.left,
        top: rect.top,
        right: rect.right - horizScrollbar,
        bottom: rect.bottom - vertScrollbar,
        width: rect.right - rect.left - horizScrollbar,
        height: rect.bottom - rect.top - vertScrollbar,
    };
}
