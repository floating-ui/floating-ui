/**
 * Get the prefixed supported property name
 * @function
 * @ignore
 * @argument {String} property (camelCase)
 * @returns {String} prefixed property (camelCase)
 */
export default function getSupportedPropertyName(property) {
    var prefixes = ['', 'ms', 'webkit', 'moz', 'o'];

    for (var i = 0; i < prefixes.length; i++) {
        var toCheck = prefixes[i] ? prefixes[i] + property.charAt(0).toUpperCase() + property.slice(1) : property;
        if (typeof window.document.body.style[toCheck] !== 'undefined') {
            return toCheck;
        }
    }
    return null;
}
