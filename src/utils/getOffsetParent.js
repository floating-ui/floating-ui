/**
 * Returns the offset parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} offset parent
 */
export default function getOffsetParent(element) {
    // NOTE: 1 DOM access here
    const offsetParent = element.offsetParent;
    return !offsetParent || offsetParent.nodeName === 'BODY' ? window.document.documentElement : offsetParent;
}
