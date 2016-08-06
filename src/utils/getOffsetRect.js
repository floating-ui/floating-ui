/**
 * Get the position of the given element, relative to its offset parent
 * @function
 * @ignore
 * @param {Element} element
 * @return {Object} position - Coordinates of the element and its `scrollTop`
 */
export default function getOffsetRect(element) {
    var elementRect = {
        width: element.offsetWidth,
        height: element.offsetHeight,
        left: element.offsetLeft,
        top: element.offsetTop
    };

    elementRect.right = elementRect.left + elementRect.width;
    elementRect.bottom = elementRect.top + elementRect.height;

    // position
    return elementRect;
}
