/**
 * Get the outer sizes of the given element (offset size + margins)
 * @function
 * @ignore
 * @argument {Element} element
 * @returns {Object} object containing width and height properties
 */
export default function getOuterSizes(element) {
    // NOTE: 1 DOM access here
    var _display = element.style.display, _visibility = element.style.visibility;
    element.style.display = 'block'; element.style.visibility = 'hidden';
    var calcWidthToForceRepaint = element.offsetWidth; // jshint ignore:line

    // original method
    var styles = window.getComputedStyle(element);
    var x = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
    var y = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
    var result = { width: element.offsetWidth + y, height: element.offsetHeight + x };

    // reset element styles
    element.style.display = _display; element.style.visibility = _visibility;
    return result;
}
