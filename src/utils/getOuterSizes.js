/**
 * Get the outer sizes of the given element (offset size + margins)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Object} object containing width and height properties
 */
export default function getOuterSizes(element) {
    // NOTE: 1 DOM access here
    const display = element.style.display;
    const visibility = element.style.visibility;

    element.style.display = 'block';
    element.style.visibility = 'hidden';

    // original method
    const styles = window.getComputedStyle(element);
    const x = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
    const y = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
    const result = {
        width: element.offsetWidth + y,
        height: element.offsetHeight + x
    };

    // reset element styles
    element.style.display = display;
    element.style.visibility = visibility;

    return result;
}
