/**
 * Returns the offset parent of the given element
 * @function
 * @ignore
 * @argument {Element} element
 * @returns {Element} offset parent
 */
export default function getOffsetParent(element) {
    // NOTE: 1 DOM access here
    const offsetParent = element.offsetParent;
    return offsetParent === window.document.body || !offsetParent ? window.document.documentElement : offsetParent;
}
