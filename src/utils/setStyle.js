/**
 * Set the style to the given popper
 * @function
 * @ignore
 * @argument {Element} element - Element to apply the style to
 * @argument {Object} styles - Object with a list of properties and values which will be applied to the element
 */
export default function setStyle(element, styles) {
    function is_numeric(n) {
        return (n !== '' && !isNaN(parseFloat(n)) && isFinite(n));
    }
    Object.keys(styles).forEach(function(prop) {
        let unit = '';
        // add unit if the value is numeric and is one of the following
        if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 && is_numeric(styles[prop])) {
            unit = 'px';
        }
        element.style[prop] = styles[prop] + unit;
    });
}
