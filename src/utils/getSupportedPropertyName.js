/**
 * Get the prefixed supported property name
 * @method
 * @memberof Popper.Utils
 * @argument {String} property (camelCase)
 * @returns {String} prefixed property (camelCase)
 */
export default function getSupportedPropertyName(property) {
    const prefixes = ['', 'ms', 'webkit', 'moz', 'o'];

    for (let i = 0; i < prefixes.length; i++) {
        const toCheck = prefixes[i] ? prefixes[i] + property.charAt(0).toUpperCase() + property.slice(1) : property;
        if (typeof window.document.body.style[toCheck] !== 'undefined') {
            return toCheck;
        }
    }
    return null;
}
