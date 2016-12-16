/**
 * Get bounding client rect of given element
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} element
 * @return {Object} client rect
 */
export default function getBoundingClientRect(element) {
    const rect = element.getBoundingClientRect();

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
