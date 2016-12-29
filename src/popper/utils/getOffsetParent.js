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

    if(!offsetParent || offsetParent.nodeName === 'BODY' || offsetParent.nodeName === 'HTML') {
        return window.document.documentElement;
    }

    return offsetParent;
}
