/**
 * Get the prefixed supported property name
 * @method
 * @memberof Popper.Utils
 * @argument {String} property (camelCase)
 * @returns {String} prefixed property (camelCase)
 */
export default function getSupportedPropertyName(property) {
    const prefixes = [false, 'ms', 'webkit', 'moz', 'o'];
    const upperProp = property.charAt(0).toUpperCase() + property.slice(1);

    for (const prefix of prefixes) {
        const toCheck = prefix ? `${prefix}${upperProp}` : property;
        if (typeof window.document.body.style[toCheck] !== 'undefined') {
            return toCheck;
        }
    }
    return null;
}
