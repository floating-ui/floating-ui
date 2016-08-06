/**
 * Check if the given variable is a function
 * @function
 * @ignore
 * @argument {Element} element - Element to check
 * @returns {Boolean} answer to: is a function?
 */
export default function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}
